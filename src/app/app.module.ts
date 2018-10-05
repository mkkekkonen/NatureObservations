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
import { NewObservationPage } from '../pages/new-observation/new-observation';
import { DebugPage } from '../pages/debug/debug';
import { MapModalPage } from '../pages/map-modal/map-modal';

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

export const createTranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, 'assets/i18n/', '.json');

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    NewObservationPage,
    DebugPage,
    MapModalPage,
    MainMenuButtonComponent,
    PlantAutocompleteComponent,
    PlantAutocompleteItemComponent,
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
    NewObservationPage,
    DebugPage,
    MapModalPage,
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
  ],
})
export class AppModule {}
