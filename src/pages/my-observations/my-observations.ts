import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, DateTime } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';
import { ImageDatabaseProvider } from '../../providers/database/image-database';
import { MapLocationDatabaseProvider } from '../../providers/database/map-location-database';
import Observation from '../../models/observation/Observation';
import { ViewObservationPage } from '../../pages/view-observation/view-observation';
import Plant from '../../models/plant/Plant';
import {
  sortObservations,
} from '../../services/my-observations/my-observations';

@IonicPage()
@Component({
  selector: 'page-my-observations',
  templateUrl: 'my-observations.html',
})
export class MyObservationsPage {
  allObservations: Observation[] = [];
  observations: Observation[] = [];

  // search
  startDateString: string = null;
  endDateString: string = null;

  // sort constants
  NAME = 'name';
  LATINNAME = 'latinName';
  DATE = 'date';
  ASC = 'ascending';
  DESC = 'descending';

  sortBy = this.DATE;
  sortOrder = this.DESC;

  searchCriteriaOpen: boolean = false;
  sortCriteriaOpen: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private observationDb: ObservationDatabaseProvider,
              private platform: Platform, private imgDb: ImageDatabaseProvider,
              private mapLocDb: MapLocationDatabaseProvider, private translate: TranslateService) {
    this.deleteObservation = this.deleteObservation.bind(this);
  }

  get searchSortIcon() {
    if (this.searchCriteriaOpen) {
      return 'arrow-up';
    }
    return 'arrow-down';
  }

  get sortedObservations() {
    const observations = [...this.observations];
    sortObservations(observations, this.sortBy, this.sortOrder);
    return observations;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.observationDb.getObservations().then((observations) => {
        this.allObservations = observations;
        this.observations = observations;
      }).catch(err => window.alert(err.message));
    });
  }

  viewObservation(observation) {
    this.navCtrl.push(ViewObservationPage, { observation });
  }

  deleteObservation(id: number) {
    const observationIndex = this.observations.findIndex(observation => observation.id === id);
    const observation = this.observations.find(observation => observation.id === id);
    if (confirm(this.translate.instant('MYOBS.AREUSURE'))) {
      this.deleteImage(observation).then(() => {
        this.deleteMapLocation(observation).then(() => {
          this.observationDb.deleteObservation(observation.id).then(() => {
            this.observations.splice(observationIndex, 1);
          });
        });
      });
    }
  }

  toggleSearchCriteria() {
    this.searchCriteriaOpen = !this.searchCriteriaOpen;
  }

  toggleSortCriteria() {
    this.sortCriteriaOpen = !this.sortCriteriaOpen;
  }

  search() {
    let filteredObservations = this.allObservations;

    if (this.startDateString && this.startDateString.length > 0) {
      const startDate = moment(this.startDateString);
      filteredObservations = filteredObservations
        .filter(observation => observation.date.isSameOrAfter(startDate));
    }

    if (this.endDateString && this.endDateString.length > 0) {
      const endDate = moment(this.endDateString);
      filteredObservations = filteredObservations
        .filter(observation => observation.date.isSameOrBefore(endDate));
    }

    this.observations = filteredObservations;
  }

  showAll() {
    this.observations = this.allObservations;
  }

  resetForm() {
    this.startDateString = null;
    this.endDateString = null;
  }

  private deleteImage(observation: Observation): Promise<void> {
    if (observation && observation.imageData && observation.imageData.id) {
      return this.imgDb.deleteImage(observation.imageData.id);
    }
    return new Promise(resolve => resolve(null));
  }

  private deleteMapLocation(observation: Observation): Promise<void> {
    if (observation && observation.mapLocation && observation.mapLocation.id) {
      return this.mapLocDb.deleteMapLocation(observation.mapLocation.id);
    }
    return new Promise(resolve => resolve(null));
  }
}
