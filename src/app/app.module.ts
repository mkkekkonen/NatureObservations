import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { Globalization } from '@ionic-native/globalization';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { EditObservationPage } from '../pages/edit-observation/edit-observation';
import { DebugPage } from '../pages/debug/debug';
import { MapModalPage } from '../pages/map-modal/map-modal';
import { MyObservationsPage } from '../pages/my-observations/my-observations';
import { ViewObservationPage } from '../pages/view-observation/view-observation';

import { MainMenuButtonComponent } from '../components/main-menu-button/main-menu-button';
import { PlantAutocompleteComponent } from '../components/plant-autocomplete/plant-autocomplete';
import {
  PlantAutocompleteItemComponent,
} from '../components/plant-autocomplete-item/plant-autocomplete-item';
import { ObservationCardComponent } from '../components/observation-card/observation-card';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { MiddlewareProvider } from '../providers/middleware/middleware';
import { PlantDatabaseProvider } from '../providers/database/plant-database';
import { PlantMiddlewareProvider } from '../providers/middleware/plant-middleware';
import { ImageDatabaseProvider } from '../providers/database/image-database';
import { MapLocationDatabaseProvider } from '../providers/database/map-location-database';
import { ObservationDatabaseProvider } from '../providers/database/observation-database';

export const createTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, 'assets/i18n/', '.json');

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    EditObservationPage,
    DebugPage,
    MapModalPage,
    MyObservationsPage,
    ViewObservationPage,
    MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
    ObservationCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    EditObservationPage,
    DebugPage,
    MapModalPage,
    MyObservationsPage,
    ViewObservationPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    Camera,
    FilePath,
    SQLite,
    Geolocation,
    Globalization,
    TranslateService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    PlantDatabaseProvider,
    MiddlewareProvider,
    PlantMiddlewareProvider,
    ImageDatabaseProvider,
    MapLocationDatabaseProvider,
    ObservationDatabaseProvider,
  ],
})
export class AppModule {}
