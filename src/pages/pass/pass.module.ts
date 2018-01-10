import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PassPage } from './pass';

@NgModule({
  declarations: [
    PassPage,
  ],
  imports: [
    IonicPageModule.forChild(PassPage)
  ],
  exports: [
    PassPage
  ]
})
export class PassPageModule { }
