import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
} from "@angular/core";
import { QbNgxDropzonePreviewComponent } from "../ngx-dropzone-preview.component";
import { QbNgxDropzoneRemoveBadgeComponent } from "../ngx-dropzone-remove-badge/ngx-dropzone-remove-badge.component";

@Component({
  selector: "qb-ngx-dropzone-video-preview",
  imports: [QbNgxDropzoneRemoveBadgeComponent],
  template: `
    @if (src()) {
      <video controls (click)="$event.stopPropagation()">
        <source [src]="src()" />
      </video>
    }
    <ng-content select="qb-ngx-dropzone-label"></ng-content>
    @if (removable()) {
      <qb-ngx-dropzone-remove-badge (click)="_remove($event)">
      </qb-ngx-dropzone-remove-badge>
    }
  `,
  styleUrls: ["./ngx-dropzone-video-preview.component.scss"],
  providers: [
    {
      provide: QbNgxDropzonePreviewComponent,
      useExisting: QbNgxDropzoneVideoPreviewComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QbNgxDropzoneVideoPreviewComponent
  extends QbNgxDropzonePreviewComponent
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
