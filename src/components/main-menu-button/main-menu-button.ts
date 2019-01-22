import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'main-menu-button',
  templateUrl: 'main-menu-button.html',
})
export class MainMenuButtonComponent {

  @Input('text') textInput;
  @Input('iconName') iconNameInput;
  @Input('page') pageToNavigate;

  text: string;
  iconName: string;

  constructor(public navCtrl: NavController) {
  }

  ngAfterViewInit() {
    this.text = this.textInput;
    this.iconName = this.iconNameInput;
  }

  navigate() {
    if (this.pageToNavigate) {
      this.navCtrl.push(this.pageToNavigate);
    }
  }
}
