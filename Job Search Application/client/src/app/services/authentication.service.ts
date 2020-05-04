import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  setToken(token: string, id: number): void {
    localStorage.setItem(Constants.TOKEN, token);
    localStorage.setItem(Constants.J_ID, id.toString());
  }

  isLogged() {
    return localStorage.getItem(Constants.TOKEN) != null;
  }

  Login(user){
    return this.httpClient.post(environment.API_BASE_PATH + '/jobseeker/login', user)
  }

  update(user){
    return this.httpClient.put(environment.API_BASE_PATH + '/employer/updateAccount', user)
  }

  SignUp(user){
    return this.httpClient.post(environment.API_BASE_PATH + '/employer/signup', user)
  }

}
