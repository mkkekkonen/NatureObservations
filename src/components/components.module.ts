import { NgModule } from '@angular/core';
import { MainMenuButtonComponent } from './main-menu-button/main-menu-button';
import { PlantAutocompleteComponent } from './plant-autocomplete/plant-autocomplete';
import { PlantAutocompleteItemComponent } from './plant-autocomplete-item/plant-autocomplete-item';
import { ObservationCardComponent } from './observation-card/observation-card';
import { ObservationTypeEntryComponent } from './observation-type-entry/observation-type-entry';
import { CardButtonComponent } from './card-button/card-button';
@NgModule({
	declarations: [MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
    ObservationCardComponent,
    ObservationTypeEntryComponent,
    CardButtonComponent],
	imports: [],
	exports: [MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
    ObservationCardComponent,
    ObservationTypeEntryComponent,
    CardButtonComponent]
})
export class ComponentsModule {}
