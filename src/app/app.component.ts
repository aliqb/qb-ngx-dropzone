import { Component } from "@angular/core";
import { NgxDropzoneRemoveEvent } from "projects/ngx-dropzone/src/public_api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: false,
})
export class AppComponent {
  files: File[] = [];
  imageSrc : string = './assets/movie.jpg';
  videoSrc : string = './assets/video.mp4';
  onFilesAdded(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onFilesRejected(event) {
    console.log(event);
  }

  onRemove(event: NgxDropzoneRemoveEvent) {
    console.log(event);
    this.files.splice(this.files.indexOf(event.file), 1);
  }

  onRemovePredefinedImage(event: NgxDropzoneRemoveEvent) {
    console.log(event);
    this.imageSrc ='';
  }

  onRemovePredefinedVideo(event: NgxDropzoneRemoveEvent) {
    console.log(event);
    this.videoSrc ='';
  }
}
