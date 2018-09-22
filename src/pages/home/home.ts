import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MainMenuButtonComponent } from '../../components/main-menu-button/main-menu-button';
import { ObservationPage } from '../observation/observation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  observationPage = ObservationPage;

  constructor(public navCtrl: NavController) {

  }

}
