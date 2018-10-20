import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, DateTime } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ObservationDatabaseProvider } from '../../providers/database/observation-database';
import Observation from '../../models/observation/Observation';
import { ViewObservationPage } from '../../pages/view-observation/view-observation';
import { PlantAutocompleteComponent } from '../../components/plant-autocomplete/plant-autocomplete';
import Plant from '../../models/plant/Plant';

@IonicPage()
@Component({
  selector: 'page-my-observations',
  templateUrl: 'my-observations.html',
})
export class MyObservationsPage {

  @ViewChild('plantAutocomplete') plantAutocomplete: ElementRef;

  allObservations: Observation[] = [];
  observations: Observation[] = [];

  // search
  selectedPlant: Plant = null;
  startDateString: string = null;
  endDateString: string = null;

  searchCriteriaOpen: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private observationDb: ObservationDatabaseProvider,
              private platform: Platform) {
    this.deleteObservation = this.deleteObservation.bind(this);
    this.setPlant = this.setPlant.bind(this);
  }

  get searchIcon() {
    if (this.searchCriteriaOpen) {
      return 'arrow-up';
    }
    return 'arrow-down';
  }

  get latinName() {
    return this.selectedPlant && this.selectedPlant.latinName;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.observationDb.getObservations().then((observations) => {
        this.allObservations = observations;
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

  toggleSearchCriteria() {
    this.searchCriteriaOpen = !this.searchCriteriaOpen;
  }

  setPlant(plant: Plant) {
    this.selectedPlant = plant;
  }

  search() {
    let filteredObservations = this.allObservations;

    if (this.selectedPlant && this.selectedPlant.id > 0) {
      filteredObservations = filteredObservations
        .filter(observation => observation.plant.id === this.selectedPlant.id);
    }

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
    const autocompleteComponent = this.plantAutocomplete as any;
    autocompleteComponent.zeroOutText();
    this.selectedPlant = null;
    this.startDateString = null;
    this.endDateString = null;
  }
}
