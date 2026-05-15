import { Component, inject, input, output } from '@angular/core';
import { coerceBooleanProperty } from '../helpers';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

enum KEY_CODE {
	BACKSPACE = 8,
	DELETE = 46
}

@Component({
    selector: 'ngx-dropzone-preview',
    template: `
		<ng-content select="ngx-dropzone-label"></ng-content>
		@if (removable()) {
		  <ngx-dropzone-remove-badge (click)="_remove($event)">
		  </ngx-dropzone-remove-badge>
		}
		`,
    styleUrls: ['./ngx-dropzone-preview.component.scss'],
    standalone: false,
    host:{
      '[style]': 'hostStyle',
      '[tabindex]': '0',
      '(keyup)': 'keyEvent($event)'
    }
})
export class NgxDropzonePreviewComponent {
	protected sanitizer = inject(DomSanitizer);


	protected _file: File;

	/** The file to preview. */
  file = input<File>()

	/** Allow the user to remove files. */
  removable = input<boolean>(false, {transform:coerceBooleanProperty});


	/** Emitted when the element should be removed. */
	readonly removed = output<File>();


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
			this.removed.emit(this.file());
		}
	}

	protected async readFile(): Promise<string | ArrayBuffer> {
		return new Promise<string | ArrayBuffer>((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = e => {
				resolve((e.target as FileReader).result);
			};

			reader.onerror = e => {
				console.error(`FileReader failed on file ${this.file().name}.`);
				reject(e);
			};

			if (!this.file()) {
				return reject('No file to read. Please provide a file using the [file] Input property.');
			}

			reader.readAsDataURL(this.file());
		});
	}
}
