import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SurvivePage } from '../survive/survive';
import { DuelPage } from '../duel/duel';
import { BattlePage } from '../battle/battle';
import { PartyPage } from '../party/party';
import { ArenaPage } from '../arena/arena';

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
    this.navCtrl.push(ArenaPage)
  }

}
