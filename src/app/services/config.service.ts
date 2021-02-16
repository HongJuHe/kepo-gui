import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {IConfig, IModuleGroup, IScript, IScriptResult} from '../models/module';
import {catchError, map, tap, retry} from 'rxjs/operators';

const CONFIG_JSON = 'assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }
  requestURL: string;
  httpOptions: object;

  private static handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  loadConfig(): Observable<IModuleGroup []> {
    return this.http.get<IConfig>(CONFIG_JSON, {responseType: 'json'})
      .pipe(
        tap((r) => this.requestURL = r.url),
        map((r) => r.groups)
      );
  }

  getStatus(): Observable<IScriptResult> {
    return this.http.get<IScriptResult>(this.requestURL, {})
    .pipe(
      catchError(ConfigService.handleError)
    );
  }

  sendRequest(script: IScript): Observable<IScriptResult> {
    console.log(this.httpOptions);

    return this.http.post<IScriptResult>(this.requestURL, script, this.httpOptions)
      .pipe(
        catchError(ConfigService.handleError)
      );
  }
}
