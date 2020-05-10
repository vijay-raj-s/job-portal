import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { IJob } from '../interfaces/ijob';
import { environment } from 'src/environments/environment';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  headers : HttpHeaders;

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders();
    const jwt = localStorage.getItem(Constants.TOKEN); 
    this.headers = this.headers.set('token', jwt);
  }

  getAllJobs(): Observable<any>{ 
    return this.http.get(environment.API_BASE_PATH + '/jobs/getAllJobs');
  }

  getEmployerJobs(): Observable<any>{ 
    let employerId = localStorage.getItem(Constants.E_ID);
    return this.http.get(environment.API_BASE_PATH + `/jobs/getSingleEmployerJobs/${employerId}`);
  }

  postJob(job): Observable<any>{
    return this.http.post(environment.API_BASE_PATH + '/jobs/create', job, { headers: this.headers});
  }
}
