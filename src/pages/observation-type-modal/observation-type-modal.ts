import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import ObservationType from '../../models/observation-type/ObservationType';

import observationTypes from '../../assets/json/observation-types';

/**
 * Generated class for the ObservationTypeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observation-type-modal',
  templateUrl: 'observation-type-modal.html',
})
export class ObservationTypeModalPage {

  observationTypes: ObservationType[] = [];

  selectedTypeName = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public translate: TranslateService) {
    observationTypes.forEach((jsonType) => {
      this.observationTypes.push(
        new ObservationType(jsonType.name, jsonType.icon),
      );
    });
  }

  confirm() {
    if (!this.selectedTypeName) {
      window.alert(this.translate.instant('MYOBS.SELECTTYPE'));
      return;
    }

    const [selectedObservationType] = this.observationTypes
      .filter(type => type.name === this.selectedTypeName);

    this.viewCtrl.dismiss({ observationType: selectedObservationType });
  }
}
