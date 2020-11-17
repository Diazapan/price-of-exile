import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

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
    //console.log("Processing: ItemService");
    
    return res || {};
  }

  getItemPrice(item: Item){
    
    //console.log("Item: "+item.typeLine);


    let params = {}
    let url;

    if( item.frameType == 2){

      url = "http://127.0.0.1:5000/api/v1/item"
      params['b64'] = item.b64;
      params['league'] = 'Heist'
      //console.log("Fetching Rare item: b64 - "+params['b64']);

    }else if( item.frameType == 3){

      url = "http://127.0.0.1:5000/api/v1/unique"
      params['name'] = item.name
      switch(item.inventoryId){
        case 'Weapon':
          params['type'] = 'Weapon'
          break;
        case 'Flask':
          params['type'] = 'Flask'
          break;
        case 'Ring':
        case 'Ring2':
        case 'Amulet':
        case 'Belt':
          params['type'] = 'Accessory'
          break;
        default:
          params['type'] = 'Armour'
      }
      //console.log("Fetching Unique item: Name - "+params['name']+'. Type - '+params['type']);

    }
    // TODO: Handle Magic and Normal items

    let response = this.http.get(url, {params: params}).pipe(
      map(this.processData),
      catchError(this.handleError)
      );
    
    return response
  }
}
