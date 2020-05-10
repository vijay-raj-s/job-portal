import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { of, Observable } from 'rxjs';
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

  getAllJobs(params): Observable<any>{ 
    return this.http.get(environment.API_BASE_PATH + '/jobs/getAllJobs', { params: params} );
  }

  getEmployerJobs(params): Observable<any>{ 
    let employerId = localStorage.getItem(Constants.E_ID);
    return this.http.get(environment.API_BASE_PATH + `/jobs/getSingleEmployerJobs/${employerId}`, { params: params});
  }

  postJob(job): Observable<any>{
    return this.http.post(environment.API_BASE_PATH + '/jobs/create', job);
  }

  updateJob(job,id): Observable<any>{
    return this.http.put(environment.API_BASE_PATH + `/jobs/update/${id}`, job);
  }

  delete(id):  Observable<any>{
    return this.http.delete(environment.API_BASE_PATH + `/jobs/delete/${id}`);
  }
}
