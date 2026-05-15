import { Component, OnDestroy, computed } from "@angular/core";
import { NgxDropzonePreviewComponent } from "../ngx-dropzone-preview.component";

@Component({
  selector: "ngx-dropzone-video-preview",
  template: `
    @if (videoSrc()) {
      <video controls (click)="$event.stopPropagation()">
        <source [src]="videoSrc()" />
      </video>
    }
    <ng-content select="ngx-dropzone-label"></ng-content>
    @if (removable()) {
      <ngx-dropzone-remove-badge (click)="_remove($event)">
      </ngx-dropzone-remove-badge>
    }
  `,
  styleUrls: ["./ngx-dropzone-video-preview.component.scss"],
  providers: [
    {
      provide: NgxDropzonePreviewComponent,
      useExisting: NgxDropzoneVideoPreviewComponent,
    },
  ],
  standalone: false,
})
export class NgxDropzoneVideoPreviewComponent
  extends NgxDropzonePreviewComponent
  implements  OnDestroy
{
  videoSrc = computed<string>(() => {
    if (this.file()) {
      return URL.createObjectURL(this.file());
    }
    console.error(
      "No file to read. Please provide a file using the [file] Input property.",
    );

    return "";
  });

  ngOnDestroy() {
    URL.revokeObjectURL(this.videoSrc());
  }
}
