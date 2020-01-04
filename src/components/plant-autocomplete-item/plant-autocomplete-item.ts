import { Component, Input } from '@angular/core';

/**
 * Generated class for the PlantAutocompleteItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'plant-autocomplete-item',
  templateUrl: 'plant-autocomplete-item.html'
})
export class PlantAutocompleteItemComponent {

  @Input('plant') plant;

  constructor() {
  }

}
