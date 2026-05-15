import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  contentChildren,
  viewChild,
} from "@angular/core";
import { NgxDropzoneService, RejectedFile } from "../ngx-dropzone.service";
import { coerceBooleanProperty, coerceNumberProperty } from "../helpers";
import { NgxDropzonePreviewComponent } from "../ngx-dropzone-preview/ngx-dropzone-preview.component";

export interface NgxDropzoneChangeEvent {
  source: NgxDropzoneComponent;
  addedFiles: File[];
  rejectedFiles: RejectedFile[];
}

@Component({
  selector: "ngx-dropzone, [ngx-dropzone]",
  templateUrl: "./ngx-dropzone.component.html",
  styleUrls: ["./ngx-dropzone.component.scss"],
  providers: [NgxDropzoneService],
  standalone: false,
  host: {
    "[class.ngx-dz-disabled]": "disabledInput()",
    "[class.expandable]": "expandable()",
    "[class.unclickable]": "disableClick()",
    "[class.ngx-dz-hovered]": "_isHovered && !disabledInput()",
    "(click)": "_onClick()",
    "(dragover)": "_onDragOver($event)",
    "(dragleave)": "_onDragLeave()",
    "(drop)": "_onDrop($event)",
  },
})
export class NgxDropzoneComponent {
  private service = inject(NgxDropzoneService, { self: true });

  /** A list of the content-projected preview children. */
  readonly _previewChildren = contentChildren(NgxDropzonePreviewComponent, {
    descendants: true,
  });

  get _hasPreviews(): boolean {
    return !!this._previewChildren().length;
  }

  /** A template reference to the native file input element. */
  readonly _fileInput = viewChild<ElementRef>("fileInput");

  /** Emitted when any files were added or rejected. */
  readonly change = output<NgxDropzoneChangeEvent>();

  /** Set the accepted file types. Defaults to '*'. */
  readonly accept = input("*");

  /** Disable any user interaction with the component. */
  disabledInput = input<boolean>(false, {
    transform: coerceBooleanProperty,
    alias: "disabled",
  });

  /** Allow the selection of multiple files. */
  multiple = input<boolean>(true, { transform: coerceBooleanProperty });

  /** Set the maximum size a single file may have. */
  maxFileSize = input<number>(undefined, { transform: coerceNumberProperty });

  /** Allow the dropzone container to expand vertically. */
  expandable = input<boolean>(false, { transform: coerceBooleanProperty });

  /** Open the file selector on click. */
  disableClick = input<boolean>(false, { transform: coerceBooleanProperty });

  /** Allow dropping directories. */
  processDirectoryDrop = input<boolean>(false, {
    transform: coerceBooleanProperty,
  });

  /** Expose the id, aria-label, aria-labelledby and aria-describedby of the native file input for proper accessibility. */
  readonly id = input<string>(undefined);
  readonly ariaLabel = input<string>(undefined, { alias: "aria-label" });
  readonly ariaLabelledby = input<string>(undefined, {
    alias: "aria-labelledby",
  });
  readonly ariaDescribedBy = input<string>(undefined, {
    alias: "aria-describedby",
  });

  _isHovered = false;

  _onClick() {
    if (!this.disableClick()) {
      this.showFileSelector();
    }
  }

  _onDragOver(event) {
    if (this.disabledInput()) {
      return;
    }

    this.preventDefault(event);
    this._isHovered = true;
  }

  _onDragLeave() {
    this._isHovered = false;
  }

  _onDrop(event) {
    if (this.disabledInput()) {
      return;
    }

    this.preventDefault(event);
    this._isHovered = false;

    // if processDirectoryDrop is not enabled or webkitGetAsEntry is not supported we handle the drop as usual
    if (
      !this.processDirectoryDrop() ||
      !DataTransferItem.prototype.webkitGetAsEntry
    ) {
      this.handleFileDrop(event.dataTransfer.files);

      // if processDirectoryDrop is enabled and webkitGetAsEntry is supported we can extract files from a dropped directory
    } else {
      const droppedItems: DataTransferItem[] = event.dataTransfer.items;

      if (droppedItems.length > 0) {
        const droppedFiles: File[] = [];
        const droppedDirectories = [];

        // seperate dropped files from dropped directories for easier handling
        for (let i = 0; i < droppedItems.length; i++) {
          const entry = droppedItems[i].webkitGetAsEntry();
          if (entry.isFile) {
            droppedFiles.push(event.dataTransfer.files[i]);
          } else if (entry.isDirectory) {
            droppedDirectories.push(entry);
          }
        }

        // create a DataTransfer
        const droppedFilesList = new DataTransfer();
        droppedFiles.forEach((droppedFile) => {
          droppedFilesList.items.add(droppedFile);
        });

        // if no directory is dropped we are done and can call handleFileDrop
        if (!droppedDirectories.length && droppedFilesList.items.length) {
          this.handleFileDrop(droppedFilesList.files);
        }

        // if directories are dropped we extract the files from these directories one-by-one and add it to droppedFilesList
        if (droppedDirectories.length) {
          const extractFilesFromDirectoryCalls = [];

          for (const droppedDirectory of droppedDirectories) {
            extractFilesFromDirectoryCalls.push(
              this.extractFilesFromDirectory(droppedDirectory),
            );
          }

          // wait for all directories to be proccessed to add the extracted files afterwards
          Promise.all(extractFilesFromDirectoryCalls).then(
            (allExtractedFiles: any[]) => {
              allExtractedFiles
                .reduce((a, b) => [...a, ...b])
                .forEach((extractedFile: File) => {
                  droppedFilesList.items.add(extractedFile);
                });

              this.handleFileDrop(droppedFilesList.files);
            },
          );
        }
      }
    }
  }

  private extractFilesFromDirectory(directory) {
    async function getFileFromFileEntry(fileEntry) {
      try {
        return await new Promise((resolve, reject) =>
          fileEntry.file(resolve, reject),
        );
      } catch (err) {
        console.log("Error converting a fileEntry to a File: ", err);
      }
    }

    return new Promise((resolve, reject) => {
      const files: File[] = [];

      const dirReader = directory.createReader();

      // we need this to be a recursion because of this issue: https://bugs.chromium.org/p/chromium/issues/detail?id=514087
      const readEntries = () => {
        dirReader.readEntries(async (dirItems) => {
          if (!dirItems.length) {
            resolve(files);
          } else {
            const fileEntries = dirItems.filter((dirItem) => dirItem.isFile);

            for (const fileEntry of fileEntries) {
              const file: any = await getFileFromFileEntry(fileEntry);
              files.push(file);
            }

            readEntries();
          }
        });
      };
      readEntries();
    });
  }

  showFileSelector() {
    if (!this.disabledInput()) {
      (this._fileInput().nativeElement as HTMLInputElement).click();
    }
  }

  _onFilesSelected(event) {
    const files: FileList = event.target.files;
    this.handleFileDrop(files);

    // Reset the native file input element to allow selecting the same file again
    this._fileInput().nativeElement.value = "";

    // fix(#32): Prevent the default event behaviour which caused the change event to emit twice.
    this.preventDefault(event);
  }

  private handleFileDrop(files: FileList) {
    const result = this.service.parseFileList(
      files,
      this.accept(),
      this.maxFileSize(),
      this.multiple(),
    );

    this.change.emit({
      addedFiles: result.addedFiles,
      rejectedFiles: result.rejectedFiles,
      source: this,
    });
  }

  private preventDefault(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
