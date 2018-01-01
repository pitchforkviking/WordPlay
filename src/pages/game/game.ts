import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {

  public isValid: boolean = false;
  public isPlaced: boolean = false;

  public gameOn: boolean = false;

  public dictionary: string;
  public word: string;

  public pass: number = 0;
  public mode: number = 0;
  public turn: number = 2;


  public p2p: any = [
    {
      name: "Alex",
      avatar: "assets/imgs/Alex.png",
      lastWord: "",
      index: 0,
      score: 0,
      deck: [],
      board: [],
      bin: []
    },
    {
      name: "Zoey",
      avatar: "assets/imgs/Zoey.png",
      lastWord: "",
      index: 1,
      score: 0,
      deck: [],
      board: [],
      bin: []
    }
  ];

  public a2p: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  public a4p: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  public player: string;
  public avatar: string;
  public lastWord: string;
  public score: number = 0;
  public bin: any[] = []
  public board: any[] = []
  public borrow: any[] = []
  public deck: any[] = []

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public http: Http) {

      this.http.get('../../assets/files/dictionary.txt').subscribe(
        data => {
          this.dictionary = data.text()
        },
        err => {
          alert("Error")
        }
      );

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

  f2p(){
    this.mode = 2;
    this.a2p = this.fshuffle(this.a2p);

    this.p2p[0].deck = this.a2p.splice(0, Math.ceil(this.a2p.length / 2));
    this.p2p[1].deck = this.a2p;

    this.player = this.p2p[0].name;
    this.avatar = this.p2p[0].avatar;
    this.score = this.p2p[0].score;
    this.deck = this.p2p[0].deck;

    this.gameOn = true;
  }

  f4p(){
    this.mode = 4;
    this.a2p = this.fshuffle(this.a2p);

    this.gameOn = true;
  }

  fborrow(letter:any){
    if(this.board.length < this.turn){
      this.board.push(letter);
      this.isPlaced = true;
      this.borrow.splice(this.borrow.indexOf(letter),1);
      --this.score;
    }
  }

  fboard(letter:any){
    this.deck.push(letter);
    this.isPlaced = true;
    this.board.splice(this.board.indexOf(letter),1);
  }

  fbin(letter:any){
    this.board.push(letter);
    this.isPlaced = true;
    this.bin.splice(this.bin.indexOf(letter),1);
  }

  fdeck(letter:any){
    if(this.board.length < this.turn){
      this.board.push(letter);
      this.isPlaced = true;
      this.deck.splice(this.deck.indexOf(letter),1);
    }
  }

  fpass() {

    let index = this.pass % this.mode;

    this.p2p[index].lastWord = this.lastWord;
    this.p2p[index].score = this.score;
    this.p2p[index].deck = this.deck;
    this.p2p[index].board = this.board;
    //this.p2p[index].bin = this.bin;

    ++this.pass;
    index = this.pass % this.mode;

    if(index === 0){
      ++this.turn;
    }

    if(this.turn === 10){
      let alert = this.alertCtrl.create({
        title: this.p2p[0].score > this.p2p[1].score ? this.p2p[0].name : this.p2p[1].name,
        subTitle: 'Winner, Winner. Chicken Dinner!',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.push(HomePage)
    }

    this.borrow = this.board;
    this.player = this.p2p[index].name;
    this.avatar = this.p2p[index].avatar;
    this.score = this.p2p[index].score;
    this.deck = this.p2p[index].deck;
    //this.bin = this.p2p[index].bin;
    this.board = this.p2p[index].board;
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
        this.fpass();
      }
      else{
        this.isValid = false;
        this.score -= 1;
      }
    }

  }

}
