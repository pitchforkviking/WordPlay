import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { WordPlay } from './app.component';

//To be removed soon
import { GamePage } from '../pages/game/game';

import { HomePage } from '../pages/home/home';

import { DuelPage } from '../pages/duel/duel';
import { BattlePage } from '../pages/battle/battle';
import { PartyPage } from '../pages/party/party';
import { SurvivePage } from '../pages/survive/survive';

// import { PassPage } from '../pages/pass/pass';


@NgModule({
  declarations: [
    WordPlay,
    HomePage,

    DuelPage,
    BattlePage,
    PartyPage,
    SurvivePage,

    // PassPage,
    //remove
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

    DuelPage,
    BattlePage,
    PartyPage,
    SurvivePage,

    // PassPage,
    //remove
    GamePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
