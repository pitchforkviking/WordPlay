import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import {Player} from '../../models/player';

@Component({
  templateUrl: 'party.html'
})
export class PartyPage {

  public dictionary: string;
  public alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  public readyPlayerOne: boolean = true;
  public readyPlayerTwo: boolean = false;
  public readyPlayerThree: boolean = false;
  public readyPlayerFour: boolean = false;

  public gameOn: boolean = false;

  public playerOne: any[] = [];
  public playerTwo: any[] = [];
  public playerThree: any[] = [];
  public playerFour: any[] = [];

  public players: Player[] = [];

  public player: Player;

  public timer: any;
  public subscriber: any;
  public count: number = 20;

  public pass: number = 0;
  public mode: number = 4;
  public turn: number = 2;

  public isValid: boolean = false;
  public isPlaced: boolean = false;

  public allWords: any[] = [];
  public lastWords: any[] = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public http: Http) {

    // Load dictionary
    this.http.get('assets/files/dictionary.txt').subscribe(
      data => {
        this.dictionary = data.text()
      },
      err => {
        alert("Couldn't load the dictionary :(")
      }
    );

  }

  // Getting names from players
  fpush(letter:any){
    if(this.readyPlayerOne === true){
      if(this.playerOne.length < 4){
        this.playerOne.push(letter);
      }
    }
    else if(this.readyPlayerTwo === true){
        if(this.playerTwo.length < 4){
          this.playerTwo.push(letter);
        }
    }
    else if(this.readyPlayerThree === true){
        if(this.playerThree.length < 4){
          this.playerThree.push(letter);
        }
    }
    else{
      if(this.playerFour.length < 4){
        this.playerFour.push(letter);
      }
    }
  }

  // Name corrections for players
  fflush(letter:any){
    if(this.readyPlayerOne === true){
      this.playerOne.splice(this.playerOne.indexOf(letter),1);
    }
    else if(this.readyPlayerTwo === true){
      this.playerTwo.splice(this.playerTwo.indexOf(letter),1);
    }
    else if(this.readyPlayerThree === true){
      this.playerThree.splice(this.playerThree.indexOf(letter),1);
    }
    else{
      this.playerFour.splice(this.playerFour.indexOf(letter),1);
    }
  }

  // Player 1 ready
  freadyplayerone(){
    this.readyPlayerOne = false;
    let player = new Player();
    player.name = this.playerOne.join('');
    this.players.push(player);

    this.readyPlayerTwo = true;
  }

  // Player 2 ready
  freadyplayertwo(){
    this.readyPlayerTwo = false;
    let player = new Player();
    player.name = this.playerTwo.join('');
    this.players.push(player);

    this.readyPlayerThree = true;
  }

  // Player 3 ready
  freadyplayerthree(){
    this.readyPlayerThree = false;
    let player = new Player();
    player.name = this.playerThree.join('');
    this.players.push(player);

    this.readyPlayerFour = true;
  }

  // Player 4 ready
  freadyplayerfour(){

    let player = new Player();
    player.name = this.playerFour.join('');
    this.players.push(player);

    this.gameOn = true;

    this.player = player;

    this.fbegin();
  }

  // Countdown timer for 20 seconds
  ftimer(){
    this.timer = TimerObservable.create(1000, 1000);
    this.subscriber = this.timer.subscribe(t=> {
      --this.count;
      if(this.count === 0){
        this.fpass();
      }
    });
  }

  // Shuffles cards
  fshuffle(array:any, length:number) {
    var first = new Array(length),
    count = first.length,
    second = new Array(count);

    if (length > count){
        throw new RangeError("getRandom: more elements taken than available");
    }

    while (length--) {
        var x = Math.floor(Math.random() * count);
        first[length] = array[x in second ? second[x] : x];
        second[x] = --count;
    }
    return { first: first, second: second};
  }

  // Begin game
  fbegin(){

    // Shuffle cards
    let first = this.alphabet;
    first = first.sort(() => .5 - Math.random());

    // Split cards for 2 players
    this.players[0].deck = first.slice(0,13);
    this.players[1].deck = first.slice(13,26);

    // Shuffle cards
    let second = this.alphabet;
    second = second.sort(() => .5 - Math.random());

    // Split cards for 2 players
    this.players[2].deck = second.slice(0,13);
    this.players[3].deck = second.slice(13,26);

    // Start with Player 1
    this.player = this.players[0];

    this.ftimer();
  }

  // Borrow cards from other players
  fborrow(letter:any){
    if(this.player.board.length < this.turn){
      this.player.board.push(letter);
      //this.isPlaced = true;
      //this.borrow.splice(this.borrow.indexOf(letter),1);
      --this.player.score;
    }
  }

  // Push cards to player board
  fboard(letter:any){
    this.player.deck.push(letter);
    this.isPlaced = true;
    this.player.board.splice(this.player.board.indexOf(letter),1);
  }

  // Pop cards from board, back to deck
  fdeck(letter:any){
    if(this.player.board.length < this.turn){
      this.player.board.push(letter);
      this.isPlaced = true;
      this.player.deck.splice(this.player.deck.indexOf(letter),1);
    }
  }

  // Checks the word against dictionary
  fcheck(){
    let word = this.player.board.join('').toLowerCase();
    this.isPlaced = false;

    if(word !== ''){
      var result = this.dictionary.match(new RegExp("\\b" + word + "\\b", 'g'));
      if ( result !== null){
        this.isValid = true;
        this.isPlaced = true;
        this.player.score += word.length;
        this.dictionary = this.dictionary.replace(new RegExp("\\b" + word + "\\b", 'g'), '');

        this.allWords.unshift(word.toUpperCase());
        this.lastWords = this.allWords.slice(0,3);

        this.fpass();
      }
      else{
        this.isValid = false;
        this.player.score -= 1;
      }
    }

  }

  // Passes turn to the other player
  fpass() {

    this.count = 20;

    var index = this.pass % this.mode;
    this.players[index] = this.player;

    ++this.pass;

    index = this.pass % this.mode;

    if(index === 0){
      ++this.turn;
    }

    if(this.turn === 10){
      let alert = this.alertCtrl.create({
        title: "Game Over :)",
        buttons: ['OK']
      });
      alert.present();
      this.subscriber.unsubscribe();

    }
    else{

      this.isValid = false;
      this.isPlaced = false;

      // Combined boards of other players

      this.player = this.players[index];

      let alert = this.alertCtrl.create({
        title: this.player.name,
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
