import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { HubConnection } from '@aspnet/signalr-client';
import { ToastController } from 'ionic-angular';

import { Player } from '../../models/player';
import { HomePage } from '../home/home';

@Component({
    templateUrl: 'arena.html'
})

export class ArenaPage {

    private _hubConnection: HubConnection;
    public key: string;

    public dictionary: string;
    public alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    public readyPlayer: boolean = false;

    public gameOver: boolean = false;
    public gameOn: boolean = false;
    public isHost: boolean = false;
    public isLobby: boolean = true;
    public hasJoined: boolean = false;
    public isWaiting: boolean = false;

    public messages: string[] = [];
    public replies: string[] = ["Hello", "Good Luck", "Thanks", "Well Played", "Sorry", "Bye", "Come On"]

    public games: string[] = [];

    public playerChar: any[] = [];

    public players: Player[] = [];

    public player: Player;

    public timer: any;
    public subscriber: any;
    public count: number = 20;

    public pass: number = 0;
    public mode: number = 4;
    public turn: number = 2;
    public play: number = 0;

    public winner: string;

    public isValid: boolean = false;
    public isPlaced: boolean = false;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
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

        this._hubConnection = new HubConnection('https://wordwarhub.azurewebsites.net/WordPlay');

        this._hubConnection
            .start()
            .then(() => {
                console.log('Connection Established!');
            })
            .catch(err => console.log(err));

        this._hubConnection
            .on('fbroadcast', (message: string) => {
                let toast = this.toastCtrl.create({
                    message: message,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            });

        this._hubConnection
            .on('fjoin', (message: string, play: number) => {
                this.play = play;
                this.messages.push(message);                
            });

        this._hubConnection
            .on('flist', (groups: any[]) => {
                if (Array.isArray(groups)) {
                    groups.forEach(element => {
                        this.games.push(element);
                    });
                }
                else {
                    this.games.push(groups);
                }
            });

        this._hubConnection
            .on('fgroup', (message: string) => {
                alert(message);
            });

        this._hubConnection
            .on('fbegin', (playerArr: any[]) => {

                this.gameOn = true;
                this.fbegin();

                if (Array.isArray(playerArr)) {
                    let index = 0;
                    playerArr.forEach(element => {
                        this.players[index].name = element.name;
                        ++index;
                    });
                }
            });

        this._hubConnection
            .on('fsync', (playerArray: any[], play: number) => {
                this.fpass(playerArray, play);
            });

        this._hubConnection
            .on('fend', (winner: string) => {
                this.winner = winner;
            });
    }

    fgame(name: string) {
        this.key = name;
    }

    fhost(name: string) {

        if (name === undefined) {
            this.isHost = true;
            this.isLobby = false;
            this.key = Math.random().toString(36).substring(7);
        }
        else {
            this.key = this.player.name + '-' + this.key;
            this.messages.push(this.key);
            this._hubConnection
                .invoke('Host', this.key, this.mode, this.player.name)
                .catch(err => console.error(err));
        }
    }

    flist() {
        this._hubConnection
            .invoke('List')
            .catch(err => console.error(err));
    }

    fjoin(name: string) {
        if (name === undefined) {
            this.isHost = false;
            this.isLobby = false;
            this.flist();
        }
        else {
            this.messages.push(this.key);
            this._hubConnection
                .invoke('Join', this.key, this.mode, this.player.name)
                .catch(err => console.error(err));
        }
    }


    // Getting names from players
    fpush(letter: any) {
        if (this.playerChar.length < 5) {
            this.playerChar.push(letter);
        }
    }

    // Name corrections for players
    fflush(letter: any) {
        this.playerChar.splice(this.playerChar.indexOf(letter), 1);
    }

    // Player 1 ready
    freadyplayer() {
        this.readyPlayer = true;

        this.player = new Player();
        this.player.name = this.playerChar.join('');
        //this.players.push(this.player);

        if (this.isHost === true) {
            this.fhost(this.player.name);
        }
        else {
            this.fjoin(this.player.name);
        }

        this.hasJoined = true;
        this.isWaiting = true;
    }


    // Countdown timer for 20 seconds
    ftimer() {
        this.timer = TimerObservable.create(1000, 1000);
        this.subscriber = this.timer.subscribe(t => {
            --this.count;
            if (this.count === 0) {
                this.fsync();
            }
        });
    }

    // Shuffles cards
    fshuffle(array: any, length: number) {
        var first = new Array(length),
            count = first.length,
            second = new Array(count);

        if (length > count) {
            throw new RangeError("getRandom: more elements taken than available");
        }

        while (length--) {
            var x = Math.floor(Math.random() * count);
            first[length] = array[x in second ? second[x] : x];
            second[x] = --count;
        }
        return { first: first, second: second };
    }

    // return unique values from array
    funique(array: any) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }

    // Begin game
    fbegin() {

        this.player = new Player();

        // Shuffle cards
        let first = this.alphabet;
        first = first.sort(() => .5 - Math.random());

        // Split cards for 2 players
        this.players.push(new Player());
        this.players[0].deck = first.slice(0, 13);
        this.players.push(new Player());
        this.players[1].deck = first.slice(13, 26);

        let second = this.alphabet;
        second = second.sort(() => .5 - Math.random());

        // Split cards for 2 players
        this.players.push(new Player());
        this.players[2].deck = second.slice(0, 13);
        this.players.push(new Player());
        this.players[3].deck = second.slice(13, 26);

        // Start with Player 1               
        this.player = this.players[this.play];

        // Play if it's your turn, wait otherwise
        if (this.pass % this.mode === this.play) {
            this.isWaiting = false;
            this.ftimer();
        }
        else {
            this.isWaiting = true;
        }
    }

    fbroadcast(reply: string) {
        let message = reply;
        this._hubConnection
            .invoke('Broadcast', this.key, message)
            .catch(err => console.error(err));
    }

    // Borrow cards from other players
    fborrow(letter: any) {
        if (this.player.board.length < this.turn) {
            this.player.board.push(letter);
            this.isPlaced = true;

            this.player.borrow.splice(this.player.borrow.indexOf(letter), 1);

            --this.player.score;
        }
    }

    // Push cards to player board
    fboard(letter: any) {
        this.player.deck.push(letter);
        this.isPlaced = true;
        this.player.board.splice(this.player.board.indexOf(letter), 1);
    }

    // Pop cards from board, back to deck
    fdeck(letter: any) {
        if (this.player.board.length < this.turn) {
            this.player.board.push(letter);
            this.isPlaced = true;
            this.player.deck.splice(this.player.deck.indexOf(letter), 1);
        }
    }

    // Checks the word against dictionary
    fcheck() {
        let word = this.player.board.join('').toLowerCase();
        this.isPlaced = false;

        if (word !== '') {
            var result = this.dictionary.match(new RegExp("\\b" + word + "\\b", 'g'));
            if (result !== null) {
                this.isValid = true;
                this.isPlaced = true;
                this.player.score += word.length;
                this.dictionary = this.dictionary.replace(new RegExp("\\b" + word + "\\b", 'g'), '');

                this.fsync();
            }
            else {
                this.isValid = false;
                this.player.score -= 1;
            }
        }

    }

    // Sync data between players
    fsync() {
        var index = this.pass % this.mode;
        this.players[index] = this.player;

        this._hubConnection
            .invoke('Sync', this.key, this.players, this.pass)
            .catch(err => console.error(err));
    }

    // Passes turn to the other player
    fpass(playerArr: any[], play: number) {

        this.count = 20;
        this.pass = play;
        this.players = playerArr;

        var index = this.pass % this.mode;

        if (index === 0) {
            this.turn += 1;
        }

        // Play if it's your turn, wait otherwise
        if (this.pass % this.mode === this.play) {
            this.isWaiting = false;
            this.ftimer();
        }
        else {
            if (this.subscriber != undefined) {
                this.subscriber.unsubscribe();
            }

            this.isWaiting = true;            
        }

        if (this.turn === 10) {

            this.gameOver = true;

            this._hubConnection
                .invoke('Delete', this.key)
                .catch(err => console.error(err));

            this.winner = this.players[0].score > this.players[1].score ?
                (this.players[0].score > this.players[2].score ?
                    (this.players[0].score > this.players[3].score ? this.players[0].name : this.players[3].name)
                    : (this.players[2].score > this.players[3].score ? this.players[2].name : this.players[3].name))
                : (this.players[1].score > this.players[2].score ?
                    (this.players[1].score > this.players[3].score ? this.players[1].name : this.players[3].name)
                    : (this.players[2].score > this.players[3].score ? this.players[2].name : this.players[3].name));

            this._hubConnection
                .invoke('End', this.key, this.winner)
                .catch(err => console.error(err));

            this.subscriber.unsubscribe();
        }
        else {

            this.isValid = false;
            this.isPlaced = false;

            this.player = this.players[index];

            // Combined boards of other players
            let count = 0;
            let array = [];
            while (count < this.mode) {
                if (count != index) {
                    array = array.concat(this.players[count].board);
                }
                ++count;
            }

            let first = this.funique(array);
            let second = this.player.deck.concat(this.player.board);

            this.player.borrow = first.filter(function (x) { return second.indexOf(x) < 0 })

        }
    }

    fhome() {
        this.navCtrl.push(HomePage);
    }

}
