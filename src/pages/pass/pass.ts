import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'pass.html'
})
export class PassPage {

    public name: string;

    constructor(
      public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController) {

      this.name = this.params.get('player');
   }

   fdismiss() {
    this.viewCtrl.dismiss();
  }
}
