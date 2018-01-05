import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'party.html'
})
export class PartyPage {

  public dictionary: string;

  public letters: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  public players: any = [
    {
      name: '',
      index: 0,
      score: 0,
      deck: [],
      board: [],
      borrow: []
    }
  ];

  public player: any = {
    name: '',
    index: 0,
    score: 0,
    deck: [],
    board: [],
    borrow: []
  };

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

  }

}
