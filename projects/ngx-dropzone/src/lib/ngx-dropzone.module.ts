import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QbNgxDropzoneLabelDirective } from './ngx-dropzone-label.directive';
import { QbNgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';
import { QbNgxDropzoneComponent } from './ngx-dropzone/ngx-dropzone.component';
import { QbNgxDropzoneImagePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-image-preview/ngx-dropzone-image-preview.component';
import { QbNgxDropzoneVideoPreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-video-preview/ngx-dropzone-video-preview.component';
import { QbNgxDropzoneFileIconPreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-file-icon-preview/ngx-dropzone-file-icon-preview.component';
import { QbNgxDropzoneRemoveBadgeComponent } from '../public_api';

@NgModule({
	imports: [
		CommonModule,
		QbNgxDropzoneComponent,
    QbNgxDropzoneLabelDirective,
    QbNgxDropzonePreviewComponent,
    QbNgxDropzoneImagePreviewComponent,
    QbNgxDropzoneRemoveBadgeComponent,
    QbNgxDropzoneVideoPreviewComponent,
    QbNgxDropzoneFileIconPreviewComponent
	],

	exports: [
		QbNgxDropzoneComponent,
		QbNgxDropzoneLabelDirective,
		QbNgxDropzonePreviewComponent,
		QbNgxDropzoneImagePreviewComponent,
		QbNgxDropzoneRemoveBadgeComponent,
		QbNgxDropzoneVideoPreviewComponent,
    QbNgxDropzoneFileIconPreviewComponent

	]
})
export class QbNgxDropzoneModule { }
