import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { IJob } from 'src/app/interfaces/ijob';

@Component({
  selector: 'app-employer-interviews',
  templateUrl: './employer-interviews.component.html',
  styleUrls: ['./employer-interviews.component.sass']
})
export class EmployerInterviewsComponent implements OnInit {

  searchText: string = ''
  jobs: Array<IJob> = [];
  currentJob: IJob;

  constructor(private jobService: JobService) { 
    this.getJobs();
  }

  ngOnInit(): void {
  }

  getJobs(){
    this.jobService.getEmployerJobs().subscribe(res => {
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
