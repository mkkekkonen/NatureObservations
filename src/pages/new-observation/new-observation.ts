import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import Observation from '../../models/observation/Observation';
import ImgData from '../../models/image-data/ImgData';
import Plant from '../../models/plant/Plant';

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

  observation: Observation = new Observation();

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

    this.setPlant = this.setPlant.bind(this);
  }

  get imageUrl() {
    if (this.observation.imageData) {
      if (this.DEBUG && this.observation.imageData.debugDataUri) {
        return this.observation.imageData.debugDataUri;
      }
      if (!this.DEBUG && this.observation.imageData.fileUri) {
        return this.observation.imageData.fileUri;
      }
    }
    return 'assets/imgs/default_leaf.jpg';
  }

  get latinName() {
    return this.observation.plant && this.observation.plant.latinName;
  }

  takePicture(photoLibrary: boolean) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {

        this.camera.getPicture(photoLibrary ? this.photoLibraryOptions : this.cameraOptions)
          .then((imageUrl) => {
            if (!this.DEBUG) {
              this.filePath.resolveNativePath(imageUrl)
                .then((path) => {
                  this.observation.imageData = new ImgData(path);
                }).catch((error) => {
                  window.alert(error.message);
                });
            } else {
              this.observation.imageData = new ImgData(null, `data:image/png;base64,${imageUrl}`);
            }
          });

      }
    });
  }

  setPlant(plant: Plant) {
    this.observation.plant = plant;
  }
}
