import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { of, Observable } from 'rxjs';
import {LoginModel} from '../interfaces/login-model'
import { IJob } from '../interfaces/ijob';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  getAllJobs(): Observable<any>{ 
    return this.http.get(environment.API_BASE_PATH + '/jobs/getAllJobs');
  }
}