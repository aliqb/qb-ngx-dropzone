import { Component } from "@angular/core";
import { QbNgxDropzoneModule, QbNgxDropzoneRemoveEvent } from "projects/ngx-dropzone/src/public_api";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    imports:[QbNgxDropzoneModule]
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

  onRemove(event: QbNgxDropzoneRemoveEvent) {
    console.log(event);
    this.files.splice(this.files.indexOf(event.file), 1);
  }

  onRemovePredefinedImage(event: QbNgxDropzoneRemoveEvent) {
    console.log(event);
    this.imageSrc ='';
  }

  onRemovePredefinedVideo(event: QbNgxDropzoneRemoveEvent) {
    console.log(event);
    this.videoSrc ='';
  }
}
