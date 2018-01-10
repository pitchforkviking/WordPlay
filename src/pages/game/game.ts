import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
//import { Subscription } from "rxjs/Subscription";
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { HubConnection } from '@aspnet/signalr-client';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {

  private _hubConnection: HubConnection;

  nick = '';
  message = '';
  messages: string[] = [];
  public key: string;

  public timer: any;
  public subscriber: any;
  public count: number = 20;

  public isValid: boolean = false;
  public isPlaced: boolean = false;

  public readyPlayerOne: boolean = false;
  public readyPlayerTwo: boolean = false;

  public playerOne: any[] = [];
  public playerTwo: any[] = [];

  public gameOn: boolean = false;

  public dictionary: string;
  public word: string;

  public pass: number = 0;
  public mode: number = 0;
  public turn: number = 2;

  public p2p: any = [
    {
      name: "",
      //avatar: "assets/imgs/Alex.png",
      //lastWord: "",
      index: 0,
      score: 0,
      deck: [],
      board: [],
      bin: []
    },
    {
      name: "",
      //avatar: "assets/imgs/Zoey.png",
      //lastWord: "",
      index: 1,
      score: 0,
      deck: [],
      board: [],
      bin: []
    }
  ];

  public letters:any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  //public a4p: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  public player: string;
  public avatar: string;
  public lastWord: string;
  public score: number = 0;
  public bin: any[] = []
  public board: any[] = []
  public borrow: any[] = []
  public deck: any[] = []

  public enemy: any = {
    name: "",
    score: 0
  };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public http: Http) {

      this.http.get('assets/files/dictionary.txt').subscribe(
        data => {
          this.dictionary = data.text()
        },
        err => {
          alert("Couldn't load the dictionary :(")
        }
      );

  }

  public fconnect(): void {    
    alert(this.key);
    this._hubConnection
      .invoke('Connect', this.key)
      .catch(err => console.error(err));
  }

  public sendMessage(): void {
    this._hubConnection
      .invoke('sendToClient', this.key)
      .catch(err => console.error(err));
  }  

  ngOnInit() {
    this.nick = window.prompt('Your name:', 'John');

    this._hubConnection = new HubConnection('http://localhost:5000/chat');

    this._hubConnection
      .start()
      .then(() => {
        console.log('Connection started!');
      })
      .catch(err => console.log('Error while establishing connection :('));

      this._hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
        const text = `${nick}: ${receivedMessage}`;
        this.messages.push(text);
      });

    }

  fpush(letter:any){
    if(this.readyPlayerOne === false){
      if(this.playerOne.length < 4){
        this.playerOne.push(letter);
      }
    }
    else{
        if(this.playerTwo.length < 4){
          this.playerTwo.push(letter);
        }
    }
  }

  fflush(letter:any){
    if(this.readyPlayerOne === false){
      this.playerOne.splice(this.playerOne.indexOf(letter),1);
    }
    else{
      this.playerTwo.splice(this.playerTwo.indexOf(letter),1);
    }
  }

  freadyplayerone(){
    this.readyPlayerOne = true;
    this.player = this.playerOne.join('');
  }

  freadyplayertwo(){
    this.readyPlayerTwo = true;
    this.enemy.name = this.playerTwo.join('');
    this.f2p();
  }

  ftimer(){
    this.timer = TimerObservable.create(1000, 1000);
    this.subscriber = this.timer.subscribe(t=> {
      --this.count;
      if(this.count === 0){
        this.fpass();
      }
    });
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
    this.letters = this.fshuffle(this.letters);

    this.p2p[0].deck = this.letters.splice(0, Math.ceil(this.letters.length / 2));
    this.p2p[1].deck = this.letters;

    this.p2p[0].name = this.player;
    //this.avatar = this.p2p[0].avatar;
    this.score = this.p2p[0].score;
    this.deck = this.p2p[0].deck;

    this.p2p[1].name = this.enemy.name;
    this.enemy.score = this.p2p[1].score;

    this.gameOn = true;

    this.ftimer();
  }

  f4p(){
    this.mode = 4;
    this.letters = this.fshuffle(this.letters);

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

  fdeck(letter:any){
    if(this.board.length < this.turn){
      this.board.push(letter);
      this.isPlaced = true;
      this.deck.splice(this.deck.indexOf(letter),1);
    }
  }

  fpass() {

    this.count = 60;

    let index = this.pass % this.mode;

    this.p2p[index].lastWord = this.lastWord;
    this.p2p[index].score = this.score;
    this.p2p[index].deck = this.deck;
    this.p2p[index].board = this.board;
    //this.p2p[index].bin = this.bin;

    this.enemy.name = this.player;
    this.enemy.score = this.score;

    ++this.pass;
    index = this.pass % this.mode;

    if(index === 0){
      ++this.turn;
    }

    if(this.turn === 10){
      let alert = this.alertCtrl.create({
        title: (this.p2p[0].score > this.p2p[1].score ? this.p2p[0].name : this.p2p[1].name) + ' WON :)',
        //subTitle: 'Winner, Winner. Chicken Dinner!',
        buttons: ['OK']
      });
      alert.present();
      this.subscriber.unsubscribe();
      this.navCtrl.push(HomePage)
    }
    else{
      this.isValid = false;
      this.isPlaced = false;

      this.borrow = this.board;
      this.player = this.p2p[index].name;
      this.avatar = this.p2p[index].avatar;
      this.score = this.p2p[index].score;
      this.deck = this.p2p[index].deck;
      //this.bin = this.p2p[index].bin;
      this.board = this.p2p[index].board;

      let modal = this.modalCtrl.create("PassPage", {player: this.player});
      modal.onDidDismiss(() => {
        this.count = 20;
      });
      modal.present();

      // let confirm = this.alertCtrl.create({
      //   title: 'PASS THE DEVICE TO ' + this.player + ' :(',
      //   //subTitle: 'Borrowing is legal, try it!',
      //   buttons: [
      //     {
      //       text: 'OK',
      //       handler: () => {
      //         this.count = 20;
      //       }
      //     }
      //   ]
      // });
      // confirm.present();
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
        this.fpass();
      }
      else{
        this.isValid = false;
        this.score -= 1;
      }
    }

  }

}
