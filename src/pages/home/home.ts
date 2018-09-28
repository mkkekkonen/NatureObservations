import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MainMenuButtonComponent } from '../../components/main-menu-button/main-menu-button';
import { NewObservationPage } from '../new-observation/new-observation';
import { DebugPage } from '../debug/debug';
import { PlantDatabaseProvider } from '../../providers/database/plant-database';
import * as plantMiddleware from '../../providers/middleware/plant-middleware';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  DEBUG = true;

  newObservationPage = NewObservationPage;
  debugPage = DebugPage;

  constructor(public navCtrl: NavController, private plantDb: PlantDatabaseProvider) {

  }

  ionViewDidEnter() {
    plantMiddleware.getPlants().then((plants) => {
      this.plantDb.updatePlants(plants);
    });
  }
}
