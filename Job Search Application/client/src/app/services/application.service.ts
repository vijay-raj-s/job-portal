import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClient: HttpClient) { }

  getJobApplications(params){
    return this.httpClient.get(environment.API_BASE_PATH + '/application/getApplications', { params: params} );
  }

  applyJob(application){
    return this.httpClient.put(environment.API_BASE_PATH + '/application/apply', application);
  }


  
}
