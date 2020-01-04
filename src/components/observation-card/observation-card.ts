import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Observation from '../../models/observation/Observation';
import { ImageDatabaseProvider } from '../../providers/database/image-database';
import { MapLocationDatabaseProvider } from '../../providers/database/map-location-database';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';

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
  @Input('deleteObservationCallback') deleteObservationCallback;

  constructor() {
    console.log('Hello ObservationCardComponent Component');
  }

  delete(event) {
    event.stopPropagation();
    this.deleteObservationCallback && this.deleteObservationCallback(this.observation.id);
  }
}
