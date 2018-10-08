import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';
import Observation from '../../models/observation/Observation';
import { ViewObservationPage } from '../../pages/view-observation/view-observation';

@IonicPage()
@Component({
  selector: 'page-my-observations',
  templateUrl: 'my-observations.html',
})
export class MyObservationsPage {

  observations: Observation[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private observationDb: ObservationDatabaseProvider,
              private platform: Platform) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.observationDb.getObservations().then((observations) => {
        this.observations = observations;
      });
    });
  }

  viewObservation(observation) {
    this.navCtrl.push(ViewObservationPage, { observation });
  }
}
