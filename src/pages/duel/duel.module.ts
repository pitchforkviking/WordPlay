import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { DuelPage } from './duel';

@NgModule({
  declarations: [
    DuelPage
  ],

  imports: [
    IonicPageModule.forChild(DuelPage)
  ],

  exports: [
    DuelPage
  ]
})

export class DuelPageModule { }
