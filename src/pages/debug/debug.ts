import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { PlantDatabaseProvider } from '../../providers/database/plant-database';
import { ImageDatabaseProvider } from '../../providers/database/image-database';
import { MapLocationDatabaseProvider } from '../../providers/database/map-location-database';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';

@IonicPage()
@Component({
  selector: 'page-debug',
  templateUrl: 'debug.html',
})
export class DebugPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private plantDb: PlantDatabaseProvider, private imgDb: ImageDatabaseProvider,
              private mapLocDb: MapLocationDatabaseProvider,
              private obsDb: ObservationDatabaseProvider, private db: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebugPage');
  }

  setDate() {
    this.plantDb.updateUpdated();
  }

  deleteImages() {
    this.imgDb.deleteAllImages();
  }

  setLocalStorage1() {
    localStorage.setItem('dbversion', '1');
  }

  setLocalStorage() {
    localStorage.setItem('dbversion', '2');
  }

  deleteData() {
    this.imgDb.deleteAllImages();
    this.mapLocDb.deleteMapLocations();
    this.obsDb.deleteObservations();
  }

  nukeDb() {
    this.db.nukeDb();
  }
}
