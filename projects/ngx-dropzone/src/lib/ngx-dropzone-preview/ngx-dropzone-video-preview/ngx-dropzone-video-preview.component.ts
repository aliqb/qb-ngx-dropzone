import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
} from "@angular/core";
import { NgxDropzonePreviewComponent } from "../ngx-dropzone-preview.component";
import { NgxDropzoneRemoveBadgeComponent } from "../ngx-dropzone-remove-badge/ngx-dropzone-remove-badge.component";

@Component({
  selector: "ngx-dropzone-video-preview",
  imports: [NgxDropzoneRemoveBadgeComponent],
  template: `
    @if (src()) {
      <video controls (click)="$event.stopPropagation()">
        <source [src]="src()" />
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDropzoneVideoPreviewComponent
  extends NgxDropzonePreviewComponent
  implements OnInit, OnDestroy
{
  ngOnInit(): void {
    if (this.file()) {
      this.src.set(URL.createObjectURL(this.file()));
    }
  }

  ngOnDestroy() {
    if (this.src()) {
      URL.revokeObjectURL(this.src() as string);
    }
  }
}
