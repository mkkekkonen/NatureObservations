import { NgModule } from '@angular/core';
import { MainMenuButtonComponent } from './main-menu-button/main-menu-button';
import { PlantAutocompleteComponent } from './plant-autocomplete/plant-autocomplete';
import { PlantAutocompleteItemComponent } from './plant-autocomplete-item/plant-autocomplete-item';
@NgModule({
	declarations: [MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent],
	imports: [],
	exports: [MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent]
})
export class ComponentsModule {}
