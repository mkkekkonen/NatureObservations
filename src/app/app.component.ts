import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import * as constants from '../constants/constants';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: {title: string, component: any}[];

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen, private translateService: TranslateService,
              private globalization: Globalization) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
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
    this.nav.setRoot(page.component);
  }
}
