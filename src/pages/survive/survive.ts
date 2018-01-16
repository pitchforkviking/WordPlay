import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'survive.html'
})
export class SurvivePage {

  public timer: any;
  public subscriber: any;
  public count: number = 30;

  public dictionary: string;

  public turn: number = 2;
  public score: number = 0;
  public word: string;
  public lastWord: string;

  public isValid: boolean = false;
  public isPlaced: boolean = false;

  public board: any = []
  public deck: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public http: Http) {

      this.http.get('assets/files/dictionary.txt').subscribe(
        data => {
          this.dictionary = data.text()
        },
        err => {
          alert("Couldn't load the dictionary :(")
        }
      );

      this.deck = this.fshuffle(this.deck);

      this.ftimer();

  }

  fshuffle(array:any) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;
    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  ftimer(){
    this.timer = TimerObservable.create(1000, 1000);
    this.subscriber = this.timer.subscribe(t=> {
      --this.count;
      if(this.count === 0){
        let confirm = this.alertCtrl.create({
          title: 'You Scored ' + this.score + ' Points :)',
          //subTitle: 'Borrowing is legal, try it!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.push(HomePage)
              }
            }
          ]
        });
        confirm.present();
      }
    });
  }

  fboard(letter:any){
    this.deck.push(letter);
    this.isPlaced = true;
    this.board.splice(this.board.indexOf(letter),1);
  }

  fdeck(letter:any){
    if(this.board.length < this.turn){
      this.board.push(letter);
      this.isPlaced = true;
      this.deck.splice(this.deck.indexOf(letter),1);
    }
  }

  fcheck(){
    this.word = this.board.join('').toLowerCase();
    this.isPlaced = false;
    if(this.word !== ''){
      var res = this.dictionary.match(new RegExp("\\b" + this.word + "\\b", 'g'));
      if ( res !== null){
        this.isValid = true;
        this.isPlaced = true;
        this.score += this.word.length;
        this.lastWord = this.word.toUpperCase();
        this.dictionary = this.dictionary.replace(new RegExp("\\b" + this.word + "\\b", 'g'), '');
        this.count += this.word.length;
        if(this.turn < 26){
          ++this.turn;
        }
      }
      else{
        this.isValid = false;
        --this.count;
      }
    }

  }

  fquit(){
    this.subscriber.unsubscribe();
    this.navCtrl.push(HomePage);
  }

}
