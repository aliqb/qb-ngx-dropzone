import { SafeUrl } from "@angular/platform-browser";
import { RejectedFile } from "./ngx-dropzone.service";
import { NgxDropzoneComponent } from "./ngx-dropzone/ngx-dropzone.component";
import { InjectionToken } from "@angular/core";


export interface NgxDropzoneChangeEvent {
  source: NgxDropzoneComponent;
  addedFiles: File[];
  rejectedFiles: RejectedFile[];
}

export interface NgxDropzoneRemoveEvent {
  file: File | null;
  src: string | SafeUrl | null;
}

export interface NgxIconExtension{
  extensionType:string;
  src: string;
}

