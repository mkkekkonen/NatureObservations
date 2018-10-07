import { Component, Input } from '@angular/core';
import Observation from '../../models/observation/Observation';

/**
 * Generated class for the ObservationCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'observation-card',
  templateUrl: 'observation-card.html',
})
export class ObservationCardComponent {

  @Input('observation') observation: Observation;

  constructor() {
    console.log('Hello ObservationCardComponent Component');
  }

}
