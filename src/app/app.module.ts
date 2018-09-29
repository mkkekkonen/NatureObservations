import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { NewObservationPage } from '../pages/new-observation/new-observation';
import { DebugPage } from '../pages/debug/debug';

import { MainMenuButtonComponent } from '../components/main-menu-button/main-menu-button';
import { PlantAutocompleteComponent } from '../components/plant-autocomplete/plant-autocomplete';
import {
  PlantAutocompleteItemComponent,
} from '../components/plant-autocomplete-item/plant-autocomplete-item';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { MiddlewareProvider } from '../providers/middleware/middleware';
import { PlantDatabaseProvider } from '../providers/database/plant-database';
import { PlantMiddlewareProvider } from '../providers/middleware/plant-middleware';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    NewObservationPage,
    DebugPage,
    MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    NewObservationPage,
    DebugPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    Camera,
    FilePath,
    SQLite,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    PlantDatabaseProvider,
    MiddlewareProvider,
    PlantMiddlewareProvider,
  ],
})
export class AppModule {}
