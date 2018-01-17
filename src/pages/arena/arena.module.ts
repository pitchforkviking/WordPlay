import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ArenaPage } from './arena';

@NgModule({
  declarations: [
    ArenaPage
  ],

  imports: [
    IonicPageModule.forChild(ArenaPage)
  ],

  exports: [
    ArenaPage
  ]
})

export class ArenaPageModule { }
