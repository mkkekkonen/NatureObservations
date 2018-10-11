import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
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
    this.deleteObservation = this.deleteObservation.bind(this);
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

  deleteObservation(id: number) {
    const observationIndex = this.observations.findIndex(observation => observation.id === id);
    this.observations.splice(observationIndex, 1);
  }
}
