import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class WordPlay {
  rootPage:any = HomePage;

  constructor(platform: Platform) {
  }
}
