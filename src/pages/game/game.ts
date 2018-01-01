import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';

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


  public p2p: any = [
    {
      name: "Alex",
      lastWord: "",
      index: 0,
      score: 0,
      deck: [],
      board: [],
      bin: []
    },
    {
      name: "Zoey",
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
  public lastWord: string;
  public score: number = 0;
  public bin: any[] = []
  public board: any[] = []
  public borrow: any[] = []
  public deck: any[] = []

  constructor(
    public navCtrl: NavController,
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

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
    return array;
  }

  funique(array:any) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
  }


  f2p(){
    this.mode = 2;
    this.a2p = this.fshuffle(this.a2p);

    this.p2p[0].deck = this.a2p.splice(0, Math.ceil(this.a2p.length / 2));
    this.p2p[1].deck = this.a2p;

    this.player = this.p2p[0].name;
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
    this.board.push(letter);
    this.isPlaced = true;
    this.borrow.splice(this.borrow.indexOf(letter),1);
    --this.score;
  }

  fboard(letter:any){
    this.bin.push(letter);
    this.isPlaced = true;
    this.board.splice(this.board.indexOf(letter),1);
  }

  fbin(letter:any){
    this.board.push(letter);
    this.isPlaced = true;
    this.bin.splice(this.bin.indexOf(letter),1);
  }

  fdeck(letter:any){
    this.board.push(letter);
    this.isPlaced = true;
    this.deck.splice(this.deck.indexOf(letter),1);
  }

  fpass() {

    this.p2p[this.pass % this.mode].lastWord = this.lastWord;
    this.p2p[this.pass % this.mode].score = this.score;
    this.p2p[this.pass % this.mode].deck = this.deck;
    this.p2p[this.pass % this.mode].board = this.board;
    this.p2p[this.pass % this.mode].bin = this.bin;

    ++this.pass;

    this.borrow = this.board;
    this.player = this.p2p[this.pass % this.mode].name;
    this.score = this.p2p[this.pass % this.mode].score;
    this.deck = this.p2p[this.pass % this.mode].deck;
    this.bin = this.p2p[this.pass % this.mode].bin;
    this.board = this.p2p[this.pass % this.mode].board;
  }

  fcheck(){
    alert(this.board.concat(this.bin).length);
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
