import { toBase64String } from '@angular/compiler/src/output/source_map';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, Input, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { CharacterService } from '../character.service';
import { Item } from '../item';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  @Input() charName: string;
  @Input() accountName: string;
  charJson: JSON;
  charStr: string;
  charItems: Array<Item>;
  item64: string;
  

  constructor(public charService: CharacterService) { }

  ngOnInit(): void {
    
    //this.charItems = new Array<Item>();

    //this.charService.updateItemList(this.charName, this.accountName);
    
  }

}
