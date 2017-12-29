import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {

  public isValid: bool = false;

  public dictionary: string;
  public word: string;

  public bin: any[] = []
  public board: any[] = []
  public borrow: any[] = ['Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N']
  public deck: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']

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

  fborrow(letter:any){
    this.board.push(letter);

    this.borrow.splice(this.borrow.indexOf(letter),1);
  }

  fboard(letter:any){
    this.bin.push(letter);

    this.board.splice(this.board.indexOf(letter),1);
  }

  fbin(letter:any){
    this.board.push(letter);

    this.bin.splice(this.bin.indexOf(letter),1);
  }

  fdeck(letter:any){
    this.board.push(letter);

    this.deck.splice(this.deck.indexOf(letter),1);
  }

  fpass() {
  }

  fcheck(){
    this.word = this.board.join('').toLowerCase();

    if(this.word !== ''){
      var res = this.dictionary.match("\\b" + this.word + "\\b", "g");
      if ( res !== null){
        this.isValid = true;
        alert("+" + this.word.length + " Points");
      }
      else{
        this.isValid = false;
        alert("-1 Point");
      }
    }

  }

}
