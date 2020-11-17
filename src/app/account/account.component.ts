import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { AccountService } from '../account.service'
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  
  accountName: string;
  characterList: Array<any>;
  errorMsg: string;
  charName: string;
  characterSelected: boolean;  

  constructor(private accountService: AccountService, private characterService: CharacterService) { }

  ngOnInit(): void {
    this.accountName = "Diazapan";
    this.characterList = new Array<any>();
    //this.charName = "";
    this.selectChar('HeistGangleader');
  }

  selectChar( char: string ) {
    this.charName = char;
    this.characterSelected = true;
    //this.characterService.getCharJson( this.charName, this.accountName ).subscribe();
    this.characterService.updateItemList( this.charName, this.accountName );
    console.log("Button pressed");
  }

  getAccountJson(): void {

    this.characterList = new Array<any>();
    this.accountService.getAccountJson( this.accountName ).subscribe(
      data =>  {
        //console.log("Data: "+data.toString())

        let str = JSON.stringify(data);
        let js = JSON.parse(str);

        if(str.match("Unable to retrieve account")){
          this.errorMsg = str;
        }else{
          this.errorMsg = ""
          
          js.forEach(element => {
            let char = {
              league: element['league'],
              character: element['name']
            }
            this.characterList.push(char)

          });

        }

      },

      err => {
        console.log("Error: "+err);

      }
    )

  }

}
