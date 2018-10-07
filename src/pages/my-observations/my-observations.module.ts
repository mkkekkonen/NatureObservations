import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyObservationsPage } from './my-observations';

@NgModule({
  declarations: [
    MyObservationsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyObservationsPage),
  ],
})
export class MyObservationsPageModule {}
