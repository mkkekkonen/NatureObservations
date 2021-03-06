import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController,
  ViewController,
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';

import Observation from '../../models/observation/Observation';
import ImgData from '../../models/image-data/ImgData';
import ObservationType from '../../models/observation-type/ObservationType';

import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal';
import { MapModalPage } from '../map-modal/map-modal';
import { ViewObservationPage } from '../view-observation/view-observation';

import { DatabaseProvider } from '../../providers/database/database';
import { ImageDatabaseProvider } from '../../providers/database/image-database';
import { MapLocationDatabaseProvider } from '../../providers/database/map-location-database';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';

declare var google;

declare var L;

const INITIAL_ZOOM_LEVEL = 15;

const USE_GEOLOCATION = false;

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'edit-observation.html',
})
export class EditObservationPage {

  @ViewChild('map') mapDiv: ElementRef;

  DEBUG: boolean = true;

  observation: Observation = new Observation();

  cameraOptions: CameraOptions = null;
  photoLibraryOptions: CameraOptions = null;

  map = null; // L.Map
  marker = null; // L.Marker

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera: Camera, public platform: Platform,
              private filePath: FilePath, private sanitizer: DomSanitizer,
              private geolocation: Geolocation, private modalCtrl: ModalController,
              private db: DatabaseProvider, private imageDb: ImageDatabaseProvider,
              private mapLocationDb: MapLocationDatabaseProvider,
              private observationDb: ObservationDatabaseProvider,
              private translate: TranslateService, private viewCtrl: ViewController) {
    const navParamsObs = this.navParams.get('observation');
    if (this.navParams.get('isEditModal') && navParamsObs) {
      this.observation = navParamsObs;
    }

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

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // this.mapDiv && this.initMap();
      this.initLeafletMap();
    });
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

  get title() {
    if (this.observation.id) {
      return 'NEWOBS.EDITOBS';
    }
    return 'NEWOBS.NEWOBS';
  }

  takePicture(photoLibrary: boolean) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {

        this.camera.getPicture(photoLibrary ? this.photoLibraryOptions : this.cameraOptions)
          .then((imageUrl) => {
            if (!this.DEBUG) {
              this.filePath.resolveNativePath(imageUrl)
                .then((path) => {
                  this.observation.imageData = new ImgData(null, path);
                }).catch((error) => {
                  window.alert(error.message);
                });
            } else {
              this.observation.imageData = new ImgData(
                null,
                null,
                `data:image/png;base64,${imageUrl}`,
              );
            }
          });
      }
    });
  }

  openTypeModal() {
    const typeModal = this.modalCtrl.create(ObservationTypeModalPage);
    typeModal.onDidDismiss((responseObj) => {
      if (responseObj && responseObj.observationType) {
        this.observation.type = responseObj.observationType;
      }
    });
    typeModal.present();
  }

  initLeafletMap() {
    if (USE_GEOLOCATION) {
      this.geolocation.getCurrentPosition().then((response) => {
        const latLng = [response.coords.latitude, response.coords.longitude];
        this.createLeafletMap(latLng);
      });
    } else {
      const latLng = [61.497, 23.760];
      this.createLeafletMap(latLng);
    }
  }

  createLeafletMap(latLng: number[]) {
    this.map = L.map(
      'map',
      {
        zoomControl: false,
        touchZoom: false,
        doubleClickZoom: false,
        dragging: false,
      },
    ).setView(latLng, INITIAL_ZOOM_LEVEL);
    L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(this.map);
  }

  setLeafletMarkerAndPan(latLng: number[]) {
    if (!this.marker) {
      this.marker = L.marker(latLng).addTo(this.map);
    } else {
      this.marker.setLatLng(latLng);
    }
    this.map.panTo(latLng);
  }

  openMapModal() {
    const mapModal = this.modalCtrl.create(MapModalPage);
    mapModal.onDidDismiss((responseObj) => {
      if (responseObj && responseObj.mapLocation) {
        this.observation.mapLocation = responseObj.mapLocation;
        this.setLeafletMarkerAndPan([
          responseObj.mapLocation.latitude,
          responseObj.mapLocation.longitude,
        ]);
      }
    });
    mapModal.present();
  }

  save() {
    const editingExisting = this.navParams.get('isEditModal');
    if (!editingExisting) {
      this.observationDb.insertObservation(this.observation).then(() => {
        if (this.observation.imageData) {
          this.observation.imageData.observationId = this.observation.id;
        }

        this.imageDb.insertImage(this.observation.imageData).then(() => {
          if (this.observation.mapLocation) {
            this.observation.mapLocation.observationId = this.observation.id;
          }

          this.mapLocationDb.insertMapLocation(this.observation.mapLocation).then(() => {
            this.observationDb.getObservationById(this.observation.id).then((observation) => {
              this.navCtrl.pop();
              this.navCtrl.push(
                ViewObservationPage,
                { observation },
              );
            }).catch(error => console.log(error.message));
          }).catch(error => console.log(error.message));
        }).catch(error => console.log(error.message));
      }).catch(error => console.log(error.message));
    } else {
      this.db.erasePreviousData(this.observation.id).then(() => {
        this.insertOrUpdateImage().then(() => {
          this.insertOrUpdateMapLocation().then(() => {
            this.observationDb.updateObservation(this.observation).then(() => {
              this.viewCtrl.dismiss({ observationId: this.observation.id });
            }).catch(error => console.log(error.message));
          }).catch(error => console.log(error.message));
        }).catch(error => console.log(error.message));
      });
    }
  }

  private insertOrUpdateImage(): Promise<void> {
    if (this.observation.imageData) {
      this.observation.imageData.observationId = this.observation.id;
      if (this.observation.imageData.id) {
        return this.imageDb.updateImage(this.observation.imageData);
      }
      return this.imageDb.insertImage(this.observation.imageData);
    }
    return new Promise(resolve => resolve(null));
  }

  private insertOrUpdateMapLocation(): Promise<void> {
    if (this.observation.mapLocation) {
      this.observation.mapLocation.observationId = this.observation.id;
      if (this.observation.mapLocation.id) {
        return this.mapLocationDb.updateMapLocation(this.observation.mapLocation);
      }
      return this.mapLocationDb.insertMapLocation(this.observation.mapLocation);
    }
    return new Promise(resolve => resolve(null));
  }
}
