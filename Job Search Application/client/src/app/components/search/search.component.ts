import { Component, OnInit } from '@angular/core';
import { IJob } from 'src/app/interfaces/ijob';
import { JobService } from 'src/app/services/job.service';
import { Constants } from 'src/app/constants';
import { ApplicationService } from 'src/app/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  start: number = Constants.DEFAULT_PAGINATION_START;
  limit: number = Constants.DEFAULT_PAGINATION_LIMIT;
  jobsCount: number;
  searchText: string = ''
  jobs: Array<IJob> = [];
  currentJob: IJob;

  constructor(private jobService: JobService, private applService: ApplicationService, private _snackBar: MatSnackBar) { 
    this.getJobs();
  }

  ngOnInit(): void {
  }

  getJobs(){
    let params = {
      page: this.start,
      limit: this.limit,
      q: this.searchText
    };
    this.jobService.getAllJobs(params).subscribe(res => {
      res.jobs.splice(0,1);
      this.jobs = res.jobs;

      this.jobsCount = res.totalResults - 1;
      this.currentJob  = this.jobs[0];
    },
    (err) => {
      console.log("Error while retreiving records");
      console.log(err);
    })
  }

  applyJob(){
    let data = {
      jobId : this.currentJob._id,
      employerId: this.currentJob.employerId
    }
    this.applService.applyJob(data).subscribe(response => {
      let res : any = response;
      this.openSnackBar(res.message);
    },(err) => {
      this.openSnackBar(err.error.message);
    });
  }

  setCurrentJob(job){
    this.currentJob = job;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '',{
      duration: 2000,
      horizontalPosition: 'right'
    })
  }

}
