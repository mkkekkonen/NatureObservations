import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { NewObservationPage } from '../new-observation/new-observation';
import { DebugPage } from '../debug/debug';
import { PlantDatabaseProvider } from '../../providers/database/plant-database';
import { PlantMiddlewareProvider, parsePlant } from '../../providers/middleware/plant-middleware';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  DEBUG = true;

  newObservationPage = NewObservationPage;
  debugPage = DebugPage;

  constructor(public navCtrl: NavController, private plantDb: PlantDatabaseProvider,
              private plantMiddleware: PlantMiddlewareProvider, private platform: Platform) {
  }

  ionViewDidEnter() {
    this.plantMiddleware.getPlants().subscribe(
      (plants) => {
        this.platform.ready().then(() => {
          this.plantDb.updatePlants(plants.map(plant => parsePlant(plant)));
        });
      },
      (error) => { console.log(JSON.stringify(error)); },
    );
  }
}
