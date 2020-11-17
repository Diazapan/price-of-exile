import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Observable,throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators'
import { stringify } from '@angular/compiler/src/util';
import { Item } from './item';
import { GemService } from './gem.service';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private characterJson;
  itemlist: Array<Item>;
  priceTotal;

  constructor(private http: HttpClient, private gemService: GemService, private itemService: ItemService) { 

    this.itemlist = new Array<Item>();

  }

  private handleError(error: HttpErrorResponse ){
    if(error.error instanceof ErrorEvent){
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }else{
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(error);
  }

  private processData( res: Response ){
    this.characterJson = res;
    console.log("Processing Char Service");
    return this.characterJson || {};
  }

  getCharJson(charName: string, accName: string){
    
    console.log("Calling get char json: "+ charName + " acc: "+ accName);
    
    // http://127.0.0.1:5000/api/v1/character-details?accountName=Diazapan&character=FrankOceansEleven&verbose
    //let url = "http://127.0.0.1:5000/api/v1/character-list"
    let url = "http://127.0.0.1:5000/api/v1/character-details"
    
    let params = {
      'accountName': accName,
      'character': charName
    }

    let response = this.http.get(url, {params: params}).pipe(
      map(this.processData),
      catchError(this.handleError)
      );
    
    return response
  }

  updateItemList( charName: string, accountName: string){

    this.itemlist = new Array<Item>();
    this.priceTotal = {
      'chaos': {
        'min': 0,
        'max': 0
      },
      'exalt': {
        'min': 0,
        'max': 0
      }
    }

    this.getCharJson(charName, accountName).subscribe(
      data =>  {
        let charStr = JSON.stringify(data);
        let charJson = JSON.parse(charStr);

        charJson['items'].forEach(element => {
          
          this.itemlist.push( this.makeItemFromJson(element) );

        });
                
      },

      err => {
        console.log(err);

      },

      () => {
        function compare(a: Item, b: Item){
          let order = {
            'BodyArmour': 0,
            'Weapon': 1,
            'Offhand': 2,
            'Helm': 3,
            'Gloves': 4,
            'Boots': 5,
            'Ring': 6,
            'Ring2': 7,
            'Amulet': 8,
            'Belt': 9,
            'Flask': 10,
            'Trinket': 11,
            'Weapon2': 12,
            'Offhand2': 13
          }
          //console.log("Comparing items: "+a.inventoryId+" and "+b.inventoryId);
          //console.log("Result: "+String(order[a.inventoryId])+" - "+String(order[b.inventoryId]));
          
          return order[a.inventoryId] - order[b.inventoryId]
    
        }
    
        this.itemlist.sort( compare );
      }
    )

    

  }

  makeItemFromJson(itemJson: JSON): Item{

    let item: Item = {
      name: itemJson['name'], 
      typeLine: itemJson['typeLine'],
      frameType: itemJson['frameType'],
      icon: itemJson['icon'],
      textString: itemJson['textStr'],
      b64: itemJson['b64'],
      inventoryId: itemJson['inventoryId'],
      priceInfo: {
        'loading': true,
        'min': 0,
        'max': 0,
        'average': 0,
        'currency': 'Chaos'
      },
      socketedItemPriceInfo: {
        'average': 0,
        'currency': 'Chaos'
      }
    };

    //console.log("Loading Item: "+item.name);
    
    if(item.inventoryId == 'Weapon2' || item.inventoryId == 'Offhand2'){
      item.weaponSwap = true;
    }

    let implicitMods = new Array<string>();
    if( itemJson['implicitMods'] ){
      itemJson['implicitMods'].forEach(mod => {
        implicitMods.push(mod)
      });
    }
    if(implicitMods.length > 0){
      item.implicitMods = implicitMods;
    }

    let craftedMods = new Array<string>();
    if( itemJson['craftedMods'] ){
      itemJson['craftedMods'].forEach(mod => {
        craftedMods.push(mod)
      });
    }
    if(craftedMods.length > 0){
      item.craftedMods = craftedMods;
    }
        
    let explicitMods = new Array<string>();
    if( itemJson['explicitMods']) {
      itemJson['explicitMods'].forEach(mod =>{
        explicitMods.push(mod);
      })
    }
    if(explicitMods.length > 0){
      item.explicitMods = explicitMods;
    }
    
    // Load prices of items async, only rares and uniques
    if( item.frameType == 2 || item.frameType == 3 ){

      this.itemService.getItemPrice(item).subscribe(
        data => {
          if( item.frameType == 2 ){
            item.priceInfo = {
              'loading': false,
              'min': data['min'] || 0,
              'max': data['max'] || 0,
              'average': (data['min']+data['max'])/2 || 0,
              'currency': data['currency'] || 'chaos'
            }
          }else{
            item.priceInfo = {
              'loading': false,
              'min': data[0]['chaosValue'] || 0,
              'max': data[0]['chaosValue'] || 0,
              'average': data[0]['chaosValue'] || 0,
              'currency': 'chaos'
            }
          }
        },
        error =>{
          console.log(error)
        },
        () => {
          this.priceTotal[item['priceInfo']['currency']]['min'] += item['priceInfo']['min'];
          this.priceTotal[item['priceInfo']['currency']]['max'] += item['priceInfo']['max'];
        }
      )
    }

    // Load the gems socketed in items, using gem.service to fetch the prices async
    let socketedItems = new Array<Item>();
    if( itemJson['socketedItems'] ){
      itemJson['socketedItems'].forEach(sItem => {
        let socketedItem: Item = {
          name: sItem['name'], 
          typeLine: sItem['typeLine'],
          frameType: sItem['frameType'],
          icon: sItem['icon'],
          level: 0,
          quality: 0,
          priceInfo: {
            'loading': true,
            'min': 0,
            'max': 0,
            'average': 0,
            'currency': 'Chaos'
          }
        }
        sItem['properties'].forEach(prop => {
          if(prop['name'] == 'Level'){
            let str = prop['values'][0].toString();
            if(str.includes('(')){
              socketedItem.level = str.substring(0, str.lastIndexOf('('));
            }else{
              socketedItem.level = str.substring(0, str.lastIndexOf(','));
            }
          }else if(prop['name'] == 'Quality'){
            let str = prop['values'][0].toString();
            socketedItem.quality = str.substring(str.lastIndexOf('+')+1, str.lastIndexOf('%'));
          }         
        });
        
        socketedItem.priceInfo['loading'] = true;

        this.gemService.getGemPrice(socketedItem).subscribe(
          data=>{
            //console.log("Gem "+item.typeLine+" price "+JSON.stringify(data));
            
            socketedItem.priceInfo['min'] = data['chaosValue'];
            socketedItem.priceInfo['max'] = data['chaosValue'];
            socketedItem.priceInfo['average'] = data['chaosValue']
            socketedItem.priceInfo['currency'] = 'chaos'
            socketedItem.priceInfo['loading'] = false;

          },
          err =>{
            console.log(err);
          },
          ()=>{
            item.socketedItemPriceInfo['average'] += socketedItem.priceInfo['average'];
            this.priceTotal[socketedItem.priceInfo['currency']]['min'] += socketedItem.priceInfo['average'];
            this.priceTotal[socketedItem.priceInfo['currency']]['max'] += socketedItem.priceInfo['average'];
          }
          
        )
        socketedItems.push(socketedItem);
      });
    }
    if( socketedItems.length > 0 ){
      item.socketedItems = socketedItems;
    }

    return item
  }
}
