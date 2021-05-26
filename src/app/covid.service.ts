import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(private http: HttpClient) { }

  getDetailsByCont(): Observable<any> {
    return this.http.get('https://covid-api.mmediagroup.fr/v1/cases');
  }

  getTodayDetails(): Observable<any> {
    return this.http.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
  }

  getGlobalDetails(): Observable<any> {
    return this.http.get('https://disease.sh/v3/covid-19/all');
  }
}
