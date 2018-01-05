import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PartyPage } from './party';

@NgModule({
  declarations: [
    PartyPage
  ],

  imports: [
    IonicPageModule.forChild(PartyPage)
  ],

  exports: [
    PartyPage
  ]
})

export class PartyPageModule { }
