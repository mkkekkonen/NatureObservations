import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewObservationPage } from './new-observation';

@NgModule({
  declarations: [
    NewObservationPage,
  ],
  imports: [
    IonicPageModule.forChild(NewObservationPage),
  ],
})
export class ObservationPageModule {}
