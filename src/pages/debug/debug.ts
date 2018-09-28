import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlantDatabaseProvider } from '../../providers/database/plant-database';

@IonicPage()
@Component({
  selector: 'page-debug',
  templateUrl: 'debug.html',
})
export class DebugPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private plantDb: PlantDatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DebugPage');
  }

  setDate() {
    this.plantDb.updateUpdated();
  }
}
