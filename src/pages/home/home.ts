import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GamePage } from '../game/game';

import { SurvivePage } from '../survive/survive';
import { PartyPage } from '../party/party';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  fduel() {
    this.navCtrl.push(GamePage)
  }

  fbattle(){
    this.navCtrl.push(SurvivePage)
  }

  fparty(){
    this.navCtrl.push(PartyPage)
  }

  farena() {
    this.navCtrl.push(GamePage)
  }

  fsurvive(){
    this.navCtrl.push(SurvivePage)
  }

}
