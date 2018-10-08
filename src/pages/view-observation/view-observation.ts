import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import Observation from '../../models/observation/Observation';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
