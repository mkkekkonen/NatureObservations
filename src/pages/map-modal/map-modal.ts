import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  Searchbar,
  ViewController,
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import MapLocation from '../../models/map-location/MapLocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {

  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('placesearch') placeSearchbar: Searchbar;

  map = null; // google.maps.Map
  marker = null; // google.maps.Marker
  placeAutocomplete = null; // google.maps.places.Autocomplete

  mapLocation: MapLocation = new MapLocation();
  mapLocationSet: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private platform: Platform, private viewCtrl: ViewController,
              private translate: TranslateService) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.mapDiv && this.initMapAndAutocomplete();
    });
  }

  initMapAndAutocomplete() {
    const latLng = new google.maps.LatLng(61.497, 23.760);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: 'terrain',
    };
    this.map = new google.maps.Map(this.mapDiv.nativeElement, mapOptions);
    this.map.addListener('click', (event) => {
      this.setMapLocation('', event.latLng);
    });

    this.placeAutocomplete = new google.maps.places.Autocomplete(
      this.placeSearchbar._searchbarInput.nativeElement,
    );
    this.placeAutocomplete.bindTo('bounds', this.map);
    this.placeAutocomplete.addListener('place_changed', () => {
      const place = this.placeAutocomplete.getPlace();
      if (place && place.geometry) {
        this.setMapLocation(place.name, place.geometry.location);
      } else {
        window.alert('Tapahtui virhe');
      }
    });
  }

  setMapLocation(name: string, latLng) {
    this.mapLocationSet = true;
    this.mapLocation = new MapLocation(0, name, latLng.lat(), latLng.lng());
    this.setMarkerAndPan(latLng);
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

  goBack() {
    if (!this.mapLocationSet) {
      window.alert('Valitse sijainti');
    } else {
      this.viewCtrl.dismiss({ mapLocation: this.mapLocation });
    }
  }
}
