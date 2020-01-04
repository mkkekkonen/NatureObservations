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
import { Geolocation } from '@ionic-native/geolocation';
import MapLocation from '../../models/map-location/MapLocation';

declare var google;
declare var L;

const USE_GEOLOCATION = false;

const INITIAL_ZOOM_LEVEL = 15;

@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {

  @ViewChild('map') mapDiv: ElementRef;
  @ViewChild('placesearch') placeSearchbar: Searchbar;

  map = null; // L.Map
  marker = null; // L.Marker
  searchControl = null; // L.esri.Geocoding.geosearch

  mapLocation: MapLocation = new MapLocation();

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private platform: Platform, private viewCtrl: ViewController,
              private translate: TranslateService, private geolocation: Geolocation) {
  }

  get mapLocationSet() {
    return (this.mapLocation.latitude !== null) && (this.mapLocation.longitude !== null);
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.initLeafletMap();
    });
  }

  initMapAndAutocomplete() {
    const latLng = new google.maps.LatLng(61.497, 23.760);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: 'terrain',
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.mapDiv.nativeElement, mapOptions);
    this.map.addListener('click', (event) => {
      this.setMapLocation('', event.latLng);
    });

    // this.placeAutocomplete = new google.maps.places.Autocomplete(
    //   this.placeSearchbar._searchbarInput.nativeElement,
    // );
    // this.placeAutocomplete.bindTo('bounds', this.map);
    // this.placeAutocomplete.addListener('place_changed', () => {
    //   const place = this.placeAutocomplete.getPlace();
    //   if (place && place.geometry) {
    //     this.setMapLocation(place.name, place.geometry.location);
    //   } else {
    //     window.alert('Tapahtui virhe');
    //   }
    // });
  }

  setLeafletMarkerAndPan(latLng: number[]) {
    if (!this.marker) {
      this.marker = L.marker(latLng).addTo(this.map);
    } else {
      this.marker.setLatLng(latLng);
    }
    this.map.panTo(latLng);
  }

  setMapLocation(name: string, latLng: number[]) {
    const [lat, lng] = latLng;
    this.mapLocation = new MapLocation(0, name, lat, lng);
    this.setLeafletMarkerAndPan(latLng);
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
    this.map = L.map('modalMap').setView(latLng, INITIAL_ZOOM_LEVEL);
    L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(this.map);

    const geocodeService = L.esri.Geocoding.geocodeServiceProvider({
      label: 'ArcGIS',
      url:
        'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    });

    this.searchControl = new L.esri.Geocoding.Geosearch({
      providers: [geocodeService],
      useMapBounds: false,
    });
    this.searchControl.addTo(this.map);

    this.map.on('click', (event) => {
      this.setMapLocation('', [event.latlng.lat, event.latlng.lng]);
    });

    this.searchControl.on('results', (data) => {
      if (data.results.length > 0) {
        const [results] = data.results;
        this.setMapLocation(results.text, [results.latlng.lat, results.latlng.lng]);
      }
    });
  }

  goBack() {
    if (!this.mapLocationSet) {
      window.alert('Valitse sijainti');
    } else {
      this.viewCtrl.dismiss({ mapLocation: this.mapLocation });
    }
  }

  getMyLocation() {
    if (USE_GEOLOCATION) {
      this.geolocation.getCurrentPosition().then((response) => {
        const latLng = [
          response.coords.latitude,
          response.coords.longitude,
        ];
        this.setMapLocation('', latLng);
      });
    } else {
      this.setMapLocation('', [61.497, 23.760]);
    }
  }
}
