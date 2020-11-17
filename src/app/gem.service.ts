import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class GemService {

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
    return res || {};
  }

  getGemPrice(gem: Item){
    
    let url = "http://127.0.0.1:5000/api/v1/gem"
    //console.log(gem.name+" "+gem.level+" "+gem.quality);
    
    let params = {
      'name': gem.typeLine,
      'level': gem.level.toString(),
      'quality': gem.quality.toString() || '0'
    }

    let response = this.http.get(url, {params: params}).pipe(
      map(this.processData),
      catchError(this.handleError)
      );
    
    return response
  }
}
