import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the ObservationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'new-observation.html',
})
export class NewObservationPage {

  DEBUG: boolean = true;

  imageUrl: string = null;

  cameraOptions: CameraOptions = null;
  photoLibraryOptions: CameraOptions = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera: Camera, public platform: Platform,
              private filePath: FilePath, private sanitizer: DomSanitizer) {
    this.cameraOptions = {
      quality: 100,
      destinationType: this.DEBUG ?
        this.camera.DestinationType.DATA_URL :
        this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.photoLibraryOptions = {
      quality: 100,
      destinationType: this.DEBUG ?
        this.camera.DestinationType.DATA_URL :
        this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
    };
  }

  takePicture(photoLibrary: boolean) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {

        this.camera.getPicture(photoLibrary ? this.photoLibraryOptions : this.cameraOptions)
          .then((imageUrl) => {
            if (!this.DEBUG) {
              this.filePath.resolveNativePath(imageUrl)
                .then((path) => {
                  this.imageUrl = path;
                }).catch((error) => {
                  window.alert(error.message);
                });
            } else {
              this.imageUrl = `data:image/png;base64,${imageUrl}`;
            }
          });

      }
    });
  }
}
