import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GamePage } from '../game/game';

import { SurvivePage } from '../survive/survive';
import { DuelPage } from '../duel/duel';
import { BattlePage } from '../battle/battle';
import { PartyPage } from '../party/party';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  fsurvive(){
    this.navCtrl.push(SurvivePage)
  }

  fduel() {
    this.navCtrl.push(DuelPage)
  }

  fbattle(){
    this.navCtrl.push(BattlePage)
  }

  fparty(){
    this.navCtrl.push(PartyPage)
  }

  farena() {
    this.navCtrl.push(GamePage)
  }

  ftest(){
    this.navCtrl.push(GamePage)
  }
  

}
