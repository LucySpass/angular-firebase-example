import {Component, Inject, Injectable, Input} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar'

@Injectable()
export class ConfigService {
  private weatherUrl = 'http://localhost:5000';
  private token: string;
  private adminToken: string;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
  }

  public getToken(): Observable<any> {
    return this.http.get<any>(this.weatherUrl + '/api/auth/token')
      .pipe(
        tap((result) => {
          this.token = result.token;
          this.getDataWithToken().subscribe((a) => {
            console.log('getDataWithToken', a);
          })
        }),
        catchError(this.handleError('getToken'))
      );
  }

  public getAdminToken(): Observable<any> {
    return this.http.get<any>(this.weatherUrl + '/api/auth/token/secret')
      .pipe(
        tap((result) => {
          this.adminToken = result.token;
          this.getDataWithToken().subscribe((a) => {
            console.log('getDataWithToken', a);
          })
        }),
        catchError(this.handleError('getAdminToken'))
      );
  }

  public getDataWithToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer: ${this.adminToken}`
    })
    return this.http.get<any>(this.weatherUrl + '/weatherforecast/summaries', {headers})
      .pipe(
        catchError(this.handleError('getDataWithToken'))
      );
  }

  public getWeeklyForecast(): Observable<any> {
    return this.http.get<any>(this.weatherUrl + '/weatherforecast/week')
      .pipe(
        catchError(this.handleError('getWeeklyForecast'))
      );
  }

  public getForecast(): Observable<any> {
    return this.http.get<any>(this.weatherUrl + '/api/auth/token/secret')
      .pipe(
        catchError(this.handleError('getForecast'))
      );
  }

  private handleError(operation: string, result?: any) {
    return (error: any): Observable<any> => {
      console.error(error);
      this._snackBar.openFromComponent(ErrorSnackBar, {
        duration: 5000,
        data: `Server error in ${operation}: ${error.statusText}`,
      });
      return of(result);
    };
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <div>🍕 {{data}} 🍕</div>`,
  styles: [`
    div {
      background: #ffeb3b;
      color: #000
    }
  `],
})
export class ErrorSnackBar {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
