import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import Observation from '../../models/observation/Observation';
import { EditObservationPage } from '../edit-observation/edit-observation';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';

declare var google;

@IonicPage()
@Component({
  selector: 'page-view-observation',
  templateUrl: 'view-observation.html',
})
export class ViewObservationPage {

  @ViewChild('map') mapDiv: ElementRef;

  observation: Observation;

  map = null; // google.maps.Map
  marker = null; // google.maps.Marker

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private modalCtrl: ModalController,
              private observationDb: ObservationDatabaseProvider) {
    this.observation = this.navParams.get('observation');
  }

  ionViewDidLoad() {
    this.createMap();
  }

  get imageUrl() {
    if (this.observation && this.observation.imageData) {
      return this.observation.imageData.debugDataUri || this.observation.imageData.fileUri;
    }
    return null;
  }

  get hasDescription() {
    return this.observation.description && this.observation.description.length > 0;
  }

  get dateString() {
    return this.observation.date && this.observation.date.format('D.M.YYYY HH:mm');
  }

  createMap() {
    if (this.observation.mapLocation) {
      const latLng = new google.maps.LatLng(
        this.observation.mapLocation.latitude,
        this.observation.mapLocation.longitude,
      );
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: 'terrain',
        gestureHandling: 'none',
        zoomControl: false,
        disableDefaultUI: true,
      };
      this.map = new google.maps.Map(this.mapDiv.nativeElement, mapOptions);
      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
      });
    }
  }

  setMarkerAndPan() {
    if (this.marker !== null) {
      this.marker.setMap(null);
    }
    const latLng = new google.maps.LatLng(
      this.observation.mapLocation.latitude,
      this.observation.mapLocation.longitude,
    );
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    });
    this.map.panTo(this.marker.getPosition());
  }

  edit() {
    const editModal = this.modalCtrl.create(
      EditObservationPage,
      { isEditModal: true, observation: this.observation },
    );
    editModal.onDidDismiss((responseObj) => {
      if (responseObj && responseObj.observationId) {
        this.observationDb.getObservationById(responseObj.observationId).then((observation) => {
          this.observation = observation;
          this.createMap();
        });
      }
    });
    editModal.present();
  }
}
