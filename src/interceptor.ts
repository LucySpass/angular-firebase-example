import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse, HttpClient
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {ErrorSnackBar} from "./api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private _snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this._snackBar.openFromComponent(ErrorSnackBar, {
          duration: 5000,
          data: `Server error in ${error.url.replace("http://localhost:5000/", "")}: ${error.statusText}`,
        });
        return throwError(error);
      }));
  }
}
