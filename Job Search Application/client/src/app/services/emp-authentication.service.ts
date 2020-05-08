import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpAuthenticationService {

  constructor(private httpClient: HttpClient) { }
  
  setToken(token: string, id: number): void {
    localStorage.setItem(Constants.TOKEN, token);
    localStorage.setItem(Constants.E_ID, id.toString());
  }

  isLogged() {
    return (localStorage.getItem(Constants.TOKEN) && localStorage.getItem(Constants.E_ID)) != null;
  }

  login(user){
    return this.httpClient.post(environment.API_BASE_PATH + '/employer/login', user)
  }

  update(user){
    return this.httpClient.put(environment.API_BASE_PATH + '/employer/updateAccount', user)
  }

  signup(user){
    return this.httpClient.post(environment.API_BASE_PATH + '/employer/signup', user)
  }
}
