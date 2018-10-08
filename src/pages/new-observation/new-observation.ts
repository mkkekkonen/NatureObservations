import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController,
  Modal,
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import Observation from '../../models/observation/Observation';
import ImgData from '../../models/image-data/ImgData';
import Plant from '../../models/plant/Plant';
import { MapModalPage } from '../map-modal/map-modal';
import { ViewObservationPage } from '../view-observation/view-observation';
import { ImageDatabaseProvider } from '../../providers/database/image-database';
import { MapLocationDatabaseProvider } from '../../providers/database/map-location-database';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';

declare var google;

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'new-observation.html',
})
export class NewObservationPage {

  @ViewChild('map') mapDiv: ElementRef;

  DEBUG: boolean = true;

  observation: Observation = new Observation();

  cameraOptions: CameraOptions = null;
  photoLibraryOptions: CameraOptions = null;

  map = null; // google.maps.Map
  marker = null; // google.maps.Marker

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera: Camera, public platform: Platform,
              private filePath: FilePath, private sanitizer: DomSanitizer,
              private geolocation: Geolocation, private modalCtrl: ModalController,
              private imageDb: ImageDatabaseProvider,
              private mapLocationDb: MapLocationDatabaseProvider,
              private observationDb: ObservationDatabaseProvider,
              private translate: TranslateService) {
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
    this.updateInputtedName = this.updateInputtedName.bind(this);
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.mapDiv && this.initMap();
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

  get latinName() {
    return this.observation.plant && this.observation.plant.latinName;
  }

  updateInputtedName(name) {
    this.observation.inputtedName = name;
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

  initMap() {
    try {
      if (!this.observation.mapLocation
          || (!this.observation.mapLocation.latitude && !this.observation.mapLocation.longitude)) {
        // this.geolocation.getCurrentPosition().then((response) => {
        const latLng = new google.maps.LatLng(61.497, 23.760);
          // const latLng = new google.maps.LatLng(
          //   response.coords.latitude,
          //   response.coords.longitude,
          // );
        this.createMap(latLng);
        // });
      } else {
        const latLng = new google.maps.LatLng(
          this.observation.mapLocation.latitude,
          this.observation.mapLocation.longitude,
        );
        this.createMap(latLng);
      }
    } catch (err) {
      window.alert(err.message);
    }
  }

  createMap(latLng) {
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: 'terrain',
      gestureHandling: 'none',
      zoomControl: false,
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.mapDiv.nativeElement, mapOptions);
  }

  setMarkerAndPan(latLng) {
    if (this.marker !== null) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    });
    this.map.panTo(this.marker.getPosition());
  }

  openMapModal() {
    const mapModal = this.modalCtrl.create(MapModalPage);
    mapModal.onDidDismiss((responseObj) => {
      if (responseObj && responseObj.mapLocation) {
        this.observation.mapLocation = responseObj.mapLocation;
        this.setMarkerAndPan(new google.maps.LatLng(
          responseObj.mapLocation.latitude,
          responseObj.mapLocation.longitude,
        ));
      }
    });
    mapModal.present();
  }

  setPlant(plant: Plant) {
    this.observation.plant = plant;
  }

  save() {
    if (!this.observation.plant || !this.observation.plant.id) {
      window.alert(this.translate.instant('NEWOBS.PICKPLT'));
      return;
    }

    this.imageDb.insertImage(this.observation.imageData).then(() => {
      this.mapLocationDb.insertMapLocation(this.observation.mapLocation).then(() => {
        this.observationDb.insertObservation(this.observation).then(() => {
          this.observationDb.getObservationById(this.observation.id).then((observation) => {
            this.navCtrl.pop();
            this.navCtrl.push(
              ViewObservationPage,
              { observation },
            );
          });
        });
      });
    });
  }
}
