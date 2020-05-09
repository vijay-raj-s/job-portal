import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsAuthenticationService } from './services/js-authentication.service';
import { EmpAuthenticationService } from './services/emp-authentication.service';
import { Constants } from './constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private jsAuthService: JsAuthenticationService, private empAuthService: EmpAuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const isJobSeekerLoggedIn = this.jsAuthService.isLogged();
      const isEmpLoggedIn = this.empAuthService.isLogged();
      
      if (isJobSeekerLoggedIn || isEmpLoggedIn) {
          let token = localStorage.getItem(Constants.TOKEN);
          request = request.clone({
              setHeaders: {
                  token: token
              }
          });
      }  
      return next.handle(request);
  }
}
