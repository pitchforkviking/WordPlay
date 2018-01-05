import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SurvivePage } from './survive';

@NgModule({
  declarations: [
    SurvivePage
  ],

  imports: [
    IonicPageModule.forChild(SurvivePage)
  ],

  exports: [
    SurvivePage
  ]
})

export class SurvivePageModule { }
