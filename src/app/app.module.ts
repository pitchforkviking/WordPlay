import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { WordPlay } from './app.component';

import { HomePage } from '../pages/home/home';
import { GamePage } from '../pages/game/game';

@NgModule({
  declarations: [
    WordPlay,
    HomePage,
    GamePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(WordPlay)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WordPlay,
    HomePage,
    GamePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
