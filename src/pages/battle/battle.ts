import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { HubConnection } from '@aspnet/signalr-client';

import {Player} from '../../models/player';

@Component({
  templateUrl: 'battle.html'
})

export class BattlePage {

    private _hubConnection: HubConnection;
    public key: string;

    public dictionary: string;
    public alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    public readyPlayer: boolean = false;     

    public gameOn: boolean = false;
    public isHost: boolean = false;
    public isLobby: boolean = true;
    public hasJoined: boolean = false;
    public isWaiting: boolean = false;

    public games: string[] = [];

    public playerChar: any[] = [];    

    public players: Player[] = [];

    public player: Player;
    public enemy: Player;

    public timer: any;
    public subscriber: any;
    public count: number = 20;

    public pass: number = 0;
    public mode: number = 2;
    public turn: number = 2;

    public isValid: boolean = false;
    public isPlaced: boolean = false;  

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

        this._hubConnection = new HubConnection('http://localhost:5000/chat');

        this._hubConnection
            .start()
            .then(() => {
                console.log('Connection Established!');
            })
            .catch(err => console.log('Could\'nt Connect :('));

        this._hubConnection
            .on('fbroadcast', (message: string) => {
                alert(message);
            });

        this._hubConnection
            .on('fjoin', (message: string) => {
                alert(message);
            });

        this._hubConnection
            .on('flist', (groups: string[]) => {
                this.games = groups;
            });

        this._hubConnection
            .on('fgroup', (message: string) => {
                alert(message);
            }); 
    }

    fgame(name: string){        
        this.key = name;
    }

    fhost(name:string){

        if(name === undefined){
            this.isHost = true;
            this.isLobby = false;
        }
        else{
            this.key = Math.random().toString(36).substring(7);;        
            this._hubConnection
                .invoke('Host', this.key, this.player.name)
                .catch(err => console.error(err));
        }
    }

    flist(){        
        this._hubConnection
            .invoke('List')
            .catch(err => console.error(err));
    }

    fjoin(name: string){
        if(name === undefined){
            this.isHost = false;
            this.isLobby = false;
            this.flist();
        }
        else{
            this._hubConnection
                .invoke('Join', this.key, this.player.name)
                .catch(err => console.error(err));
        }
    }


    // Getting names from players
    fpush(letter:any){        
        if(this.playerChar.length < 4){
            this.playerChar.push(letter);
        }
    }

    // Name corrections for players
    fflush(letter:any){        
        this.playerChar.splice(this.playerChar.indexOf(letter),1);
    }

    // Player 1 ready
    freadyplayer(){
        this.readyPlayer = true;
        
        this.player = new Player();
        this.player.name = this.playerChar.join('');
        this.players.push(this.player);

        if(this.isHost === true){
            this.fhost(this.player.name);
        }
        else{
            this.fjoin(this.player.name);
        }

        this.hasJoined = true;
        this.isWaiting = true;
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

        // Start with Player 1
        this.player = this.players[0];
        this.enemy = this.players[1];

        this.ftimer();
    }

    // Borrow cards from other players
    fborrow(letter:any){
        if(this.player.board.length < this.turn){
        this.player.board.push(letter);
        this.isPlaced = true;
        
        this.player.borrow.splice(this.player.borrow.indexOf(letter),1);

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
        this.enemy = this.player;

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

        this.player.borrow = this.enemy.board;

        let alert = this.alertCtrl.create({
            title: this.player.name,
            buttons: ['OK']
        });
        alert.present();
        }
    }

}
