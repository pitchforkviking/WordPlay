import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BattlePage } from './battle';

@NgModule({
  declarations: [
    BattlePage
  ],

  imports: [
    IonicPageModule.forChild(BattlePage)
  ],

  exports: [
    BattlePage
  ]
})

export class BattlePageModule { }
