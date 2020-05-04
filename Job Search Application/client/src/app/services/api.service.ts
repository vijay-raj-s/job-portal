import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { of, Observable } from 'rxjs';
import {LoginModel} from '../interfaces/login-model'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string): Observable<LoginModel>{
    let auth = false;
    let loginResult : LoginModel = {token : '', error: null, email: email, password: password};

    if (email == 'kristen@gmail.com' && password == 'abc123'){
      loginResult.token = 'asldk123213lkj213';
      loginResult.error = null;
    };
    
    return of(loginResult);
  }
}