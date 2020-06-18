import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { Constants } from 'src/app/constants';

@Component({
  selector: 'app-employer-applications',
  templateUrl: './employer-applications.component.html',
  styleUrls: ['./employer-applications.component.sass']
})
export class EmployerApplicationsComponent implements OnInit {

  _start: number = Constants.DEFAULT_PAGINATION_START;
  _limit: number = Constants.DEFAULT_PAGINATION_LIMIT;
  jobApplications: any = {}
  applicationCount: number;

  constructor(private applicationService: ApplicationService) {
    this.getJobApplications();
  }

  ngOnInit(): void {
  }

  getJobApplications(){
    let params = {
      start: this._start,
      limit: 50
    };
    this.applicationService.getJobApplications(params).subscribe(response => {
      let res : any = response;
      this.jobApplications = res.jobApplications;
      this.applicationCount = res.totalResults;
    },(err) => {
      console.log(err)
    });
  }

  viewApplication(){

  }

  reject(){
    
  }

}
