import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-screen',
  templateUrl: './upload-screen.component.html',
  styleUrls: ['./upload-screen.component.css']
})
export class UploadScreenComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  recording = false;
  videoData: Blob | null = null;
  videoDuration = 0;
  uploadProgress: number | null = null;
  uploadError: string | null = null;
  dualCameraSupported = false;
  currentCamera: 'user' | 'environment' = 'user';

  async ngOnInit() {
    try {
      const mediaDevices = navigator.mediaDevices as any;
      if (mediaDevices.getDisplayMedia || mediaDevices.getUserMedia) {
        const devices = await mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device: any) => device.kind === 'videoinput');
        if (videoDevices.length > 1) {
          this.dualCameraSupported = true;
        }
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  toggleRecording() {
    if (!this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    this.recordedChunks = [];
    this.recording = true;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: this.currentCamera }, audio: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();

        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        this.mediaRecorder.start();
        const startTime = Date.now();

        this.mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        });

        this.mediaRecorder.addEventListener('stop', () => {
          this.videoData = new Blob(this.recordedChunks, { type: 'video/webm' });
          this.videoDuration = (Date.now() - startTime) / 1000;
        });
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });
  }

  stopRecording() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
    }
  }

  switchCamera() {
    this.currentCamera = this.currentCamera === 'user' ? 'environment' : 'user';
    this.startRecording();
  }

  uploadVideo() {
    if (!this.videoData || this.videoDuration < 30) {
      return;
    }

    this.uploadProgress = 0;
    this.uploadError = null;

    const formData = new FormData();
    formData.append('video', this.videoData, 'recorded_video.webm');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'your-upload-url');
    xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
      if (event.lengthComputable) {
        this.uploadProgress = Math.round((event.loaded / event.total) * 100);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('Video upload complete');
        } else {
          this.uploadError = 'Video upload failed. Please try again.';
        }
      }
    };

    xhr.send(formData);
  }
}
