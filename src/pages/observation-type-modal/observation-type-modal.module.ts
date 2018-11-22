import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationTypeModalPage } from './observation-type-modal';

@NgModule({
  declarations: [
    ObservationTypeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ObservationTypeModalPage),
  ],
})
export class ObservationTypeModalPageModule {}
