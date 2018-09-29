import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
import { PlantDatabaseProvider } from '../../providers/database/plant-database';
import Plant from '../../models/plant/Plant';

/**
 * Generated class for the PlantAutocompleteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'plant-autocomplete',
  templateUrl: 'plant-autocomplete.html',
})
export class PlantAutocompleteComponent {

  @Input('setPlantCallback') setPlantCallback;

  text: string = '';

  showAutocomplete: boolean = false;
  allPlants: Plant[] = [];
  shownPlants: Plant[] = [];

  constructor(private plantDb: PlantDatabaseProvider, private platform: Platform) {
    platform.ready().then(() => {
      plantDb.getPlants().then((plants) => {
        this.allPlants = plants;
      });
    });
  }

  handleTextInput(event) {
    this.showAutocomplete = (event.target.value.length > 0);
    this.text = event.target.value;

    this.shownPlants = this.allPlants.filter((plant) => {
      if (!plant.name || !plant.latinName || !event.target.value) {
        return false;
      }
      return plant.name.toLowerCase().includes(event.target.value.toLowerCase())
        || plant.latinName.toLowerCase().includes(event.target.value.toLowerCase());
    }).slice(0, 5);
  }

  handleBlur() {
    this.showAutocomplete = false;
  }

  setPlant(plant: Plant) {
    this.text = plant.name;
    this.setPlantCallback(plant);
    this.showAutocomplete = false;
  }
}
