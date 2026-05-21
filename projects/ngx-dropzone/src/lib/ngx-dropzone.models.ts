import { SafeUrl } from "@angular/platform-browser";
import { RejectedFile } from "./ngx-dropzone.service";
import { QbNgxDropzoneComponent } from "./ngx-dropzone/ngx-dropzone.component";


export interface QbNgxDropzoneChangeEvent {
  source: QbNgxDropzoneComponent;
  addedFiles: File[];
  rejectedFiles: RejectedFile[];
}

export interface QbNgxDropzoneRemoveEvent {
  file: File | null;
  src: string | SafeUrl | null;
}

export interface QbNgxIconExtension{
  extensionType:string;
  src: string;
}

