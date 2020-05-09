import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsAuthenticationService {

  constructor(private httpClient: HttpClient) { }

  setToken(token: string, id: number): void {
    localStorage.setItem(Constants.TOKEN, token);
    localStorage.setItem(Constants.J_ID, id.toString());
  }

  isLogged() {
    return (localStorage.getItem(Constants.TOKEN) && localStorage.getItem(Constants.J_ID)) != null;
  }

  login(user){
    return this.httpClient.post(environment.API_BASE_PATH + '/jobseeker/login', user)
  }

  update(user){
    return this.httpClient.put(environment.API_BASE_PATH + '/jobseeker/updateAccount', user)
  }

  signup(user){
    return this.httpClient.post(environment.API_BASE_PATH + '/jobseeker/signup', user)
  }

  getDetails(){
    return this.httpClient.get(environment.API_BASE_PATH + '/jobseeker/details')
  }
}
