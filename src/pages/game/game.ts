import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'game.html'
})
export class GamePage {

  public bin: any[] = []
  public board: any[] = []
  public borrow: any[] = ['Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N']
  public deck: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']

  constructor(public navCtrl: NavController) {
  }

  fpass() {
    alert("Passing to 2P")
  }

  fcheck(){
    alert("Checking!!!")
  }

  fbin(letter:any){
    this.bin.push(letter);

    this.board.splice(this.board.indexOf(letter),1);
  }

  fboard(letter:any){
    this.board.push(letter);

    if(this.deck.indexOf(letter) != -1){
      this.deck.splice(this.deck.indexOf(letter),1);
    }

    if(this.bin.indexOf(letter) != -1){
      this.bin.splice(this.bin.indexOf(letter),1);
    }
  }

  fborrow(letter:any){
    this.board.push(letter);

    this.borrow.splice(this.borrow.indexOf(letter),1);
  }

}
