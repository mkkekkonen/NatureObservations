import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditObservationPage } from './edit-observation';

@NgModule({
  declarations: [
    EditObservationPage,
  ],
  imports: [
    IonicPageModule.forChild(EditObservationPage),
  ],
})
export class ObservationPageModule {}
