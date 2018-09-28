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

import { MainMenuButtonComponent } from '../components/main-menu-button/main-menu-button'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { MiddlewareProvider } from '../providers/middleware/middleware';
import { PlantDatabaseProvider } from '../providers/database/plant-database';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    NewObservationPage,
    DebugPage,
    MainMenuButtonComponent,
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
  ],
})
export class AppModule {}
