import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';

import { HomePage } from '../pages/home/home';
import { MyObservationsPage } from '../pages/my-observations/my-observations';
import { EditObservationPage } from '../pages/edit-observation/edit-observation';
import { CreditsPage } from '../pages/credits/credits';
import { DebugPage } from '../pages/debug/debug';

import * as constants from '../constants/constants';
import { DatabaseProvider } from '../providers/database/database';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyObservationsPage;

  pages: { name: string, component: any }[];

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen, private translateService: TranslateService,
              private globalization: Globalization, private databaseProvider: DatabaseProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { name: 'APP.HOME', component: MyObservationsPage },
      { name: 'APP.NEWOBS', component: EditObservationPage },
      { name: 'APP.CREDITS', component: CreditsPage },
      { name: 'APP.DEBUG', component: DebugPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translateService.setDefaultLang('fi');

      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then((result) => {
          const code = result.value.substring(0, 2).toLowerCase();
          if (code === 'fi') {
            this.setLanguage('fi');
          } else {
            this.setLanguage('en');
          }
        });

        this.databaseProvider.createTables();
      }
    });
  }

  setLanguage(lang) {
    this.translateService.use(lang);
    constants.systemOptions.systemLanguage = lang;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
