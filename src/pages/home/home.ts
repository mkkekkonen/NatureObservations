import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MainMenuButtonComponent } from '../../components/main-menu-button/main-menu-button';
import { NewObservationPage } from '../new-observation/new-observation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  newObservationPage = NewObservationPage;

  constructor(public navCtrl: NavController) {

  }

}
