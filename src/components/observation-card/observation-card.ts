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

  constructor(private imgDb: ImageDatabaseProvider, private mapLocDb: MapLocationDatabaseProvider,
              private obsDb: ObservationDatabaseProvider, private translate: TranslateService) {
    console.log('Hello ObservationCardComponent Component');
  }

  delete(event) {
    event.stopPropagation();
    if (confirm(this.translate.instant('OBSCARD.AREUSURE'))) {
      this.deleteImage().then(() => {
        this.deleteMapLocation().then(() => {
          this.obsDb.deleteObservation(this.observation.id).then(() => {
            this.deleteObservationCallback && this.deleteObservationCallback(this.observation.id);
          });
        });
      });
    }
  }

  private deleteImage(): Promise<void> {
    if (this.observation.imageData && this.observation.imageData.id) {
      return this.imgDb.deleteImage(this.observation.imageData.id);
    }
    return new Promise(resolve => resolve(null));
  }

  private deleteMapLocation(): Promise<void> {
    if (this.observation.mapLocation && this.observation.mapLocation.id) {
      return this.mapLocDb.deleteMapLocation(this.observation.mapLocation.id);
    }
    return new Promise(resolve => resolve(null));
  }
}
