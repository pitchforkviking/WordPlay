import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GamePage } from '../game/game';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  beginPlay() {
    this.navCtrl.push(GamePage)
  }

}
