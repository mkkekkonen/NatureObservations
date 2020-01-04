import { Component, Input } from '@angular/core';

import ObservationType from '../../models/observation-type/ObservationType';

/**
 * Generated class for the ObservationTypeEntryComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'observation-type-entry',
  templateUrl: 'observation-type-entry.html',
})
export class ObservationTypeEntryComponent {

  @Input('observationType') observationType: ObservationType;

  constructor() {
  }
}
