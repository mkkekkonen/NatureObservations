import { NgModule } from '@angular/core';
import { MainMenuButtonComponent } from './main-menu-button/main-menu-button';
import { PlantAutocompleteComponent } from './plant-autocomplete/plant-autocomplete';
import { PlantAutocompleteItemComponent } from './plant-autocomplete-item/plant-autocomplete-item';
import { ObservationCardComponent } from './observation-card/observation-card';
@NgModule({
	declarations: [MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
    ObservationCardComponent],
	imports: [],
	exports: [MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
    ObservationCardComponent]
})
export class ComponentsModule {}
