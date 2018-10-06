import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlantDatabaseProvider } from '../../providers/database/plant-database';
import { ImageDatabaseProvider } from '../../providers/database/image-database';

@IonicPage()
@Component({
  selector: 'page-debug',
  templateUrl: 'debug.html',
})
export class DebugPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private plantDb: PlantDatabaseProvider, private imgDb: ImageDatabaseProvider) {
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

  setLocalStorage() {
    localStorage.setItem('dbversion', '2');
  }
}
