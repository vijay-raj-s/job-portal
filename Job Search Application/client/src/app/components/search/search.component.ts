import { Component, OnInit } from '@angular/core';
import { IJob } from 'src/app/interfaces/ijob';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  searchText: string = ''
  jobs: Array<IJob> = [];
  currentJob: IJob;

  constructor(private jobService: JobService) { 
    this.getJobs();
  }

  ngOnInit(): void {
  }

  getJobs(){
    this.jobService.getAllJobs().subscribe(res => {
      this.jobs = res.jobs;
      this.currentJob  = this.jobs[0];
    },
    (err) => {
      console.log("Error while retreiving records");
      console.log(err);
    })
  }


  setCurrentJob(job){
    this.currentJob = job;
  }

}
