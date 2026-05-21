import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { coerceBooleanProperty } from "../helpers";
import { SafeStyle, DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { QbNgxDropzoneRemoveEvent } from "../ngx-dropzone.models";
import { QbNgxDropzoneRemoveBadgeComponent } from "./ngx-dropzone-remove-badge/ngx-dropzone-remove-badge.component";

enum KEY_CODE {
  BACKSPACE = 8,
  DELETE = 46,
}


@Component({
  selector: "qb-ngx-dropzone-preview",
  imports: [QbNgxDropzoneRemoveBadgeComponent],
  template: `
    <ng-content select="qb-ngx-dropzone-label"></ng-content>
    @if (removable()) {
      <qb-ngx-dropzone-remove-badge (click)="_remove($event)">
      </qb-ngx-dropzone-remove-badge>
    }
  `,
  styleUrls: ["./ngx-dropzone-preview.component.scss"],
  host: {
    "[style]": "hostStyle",
    "[tabindex]": "0",
    "(keyup)": "keyEvent($event)",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QbNgxDropzonePreviewComponent {
  protected sanitizer = inject(DomSanitizer);

  /** The file to preview. */
  file = input<File>();

  /** file src **/
  src = model<string | SafeUrl | null>(null);

  /** Allow the user to remove files. */
  removable = input<boolean>(false, { transform: coerceBooleanProperty });

  /** Emitted when the element should be removed. */
  readonly removed = output<QbNgxDropzoneRemoveEvent>();

  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.BACKSPACE:
      case KEY_CODE.DELETE:
        this.remove();
        break;
      default:
        break;
    }
  }

  get hostStyle(): SafeStyle {
    const styles = `
			display: flex;
			height: 140px;
			min-height: 140px;
			min-width: 180px;
			max-width: 180px;
			justify-content: center;
			align-items: center;
			padding: 0 20px;
			margin: 10px;
			border-radius: 5px;
			position: relative;
		`;

    return this.sanitizer.bypassSecurityTrustStyle(styles);
  }

  /** Remove method to be used from the template. */
  _remove(event) {
    event.stopPropagation();
    this.remove();
  }

  /** Remove the preview item (use from component code). */
  remove() {
    if (this.removable()) {
      this.removed.emit({ file: this.file(), src: this.src() });
    }
  }

  protected async readFile(): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve((e.target as FileReader).result);
      };

      reader.onerror = (e) => {
        console.error(`FileReader failed on file ${this.file().name}.`);
        reject(e);
      };

      if (!this.file()) {
        return reject(
          "No file to read. Please provide a file using the [file] Input property.",
        );
      }

      reader.readAsDataURL(this.file());
    });
  }
}
