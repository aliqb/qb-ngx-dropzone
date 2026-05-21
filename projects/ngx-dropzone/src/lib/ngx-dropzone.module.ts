import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneLabelDirective } from './ngx-dropzone-label.directive';
import { NgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';
import { NgxDropzoneComponent } from './ngx-dropzone/ngx-dropzone.component';
import { NgxDropzoneImagePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-image-preview/ngx-dropzone-image-preview.component';
import { NgxDropzoneRemoveBadgeComponent } from './ngx-dropzone-preview/ngx-dropzone-remove-badge/ngx-dropzone-remove-badge.component';
import { NgxDropzoneVideoPreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-video-preview/ngx-dropzone-video-preview.component';
import { NgxDropzoneFileIconPreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-file-icon-preview/ngx-dropzone-file-icon-preview.component';

@NgModule({
	imports: [
		CommonModule,
		NgxDropzoneComponent,
    NgxDropzoneLabelDirective,
    NgxDropzonePreviewComponent,
    NgxDropzoneImagePreviewComponent,
    NgxDropzoneRemoveBadgeComponent,
    NgxDropzoneVideoPreviewComponent,
    NgxDropzoneFileIconPreviewComponent
	],

	exports: [
		NgxDropzoneComponent,
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent,
		NgxDropzoneImagePreviewComponent,
		NgxDropzoneRemoveBadgeComponent,
		NgxDropzoneVideoPreviewComponent,
    NgxDropzoneFileIconPreviewComponent

	]
})
export class NgxDropzoneModule { }
