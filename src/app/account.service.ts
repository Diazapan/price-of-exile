import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

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
    //this.characterJson = res;
    console.log("Processing");
    return res || {};
  }

  getAccountJson(accName: string){
    
    let url = "http://127.0.0.1:5000/api/v1/character-list"
    
    let params = {
      'accountName': accName
    }

    let response = this.http.get(url, {params: params}).pipe(
      map(this.processData),
      catchError(this.handleError)
      );
    
    return response
  }

}
