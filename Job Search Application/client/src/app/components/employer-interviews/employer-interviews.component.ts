import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { IJob } from 'src/app/interfaces/ijob';
import { MatDialog } from '@angular/material/dialog';
import { DeletedialogComponent } from '../deletedialog/deletedialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants';

@Component({
  selector: 'app-employer-interviews',
  templateUrl: './employer-interviews.component.html',
  styleUrls: ['./employer-interviews.component.sass']
})
export class EmployerInterviewsComponent implements OnInit {
  start: number = Constants.DEFAULT_PAGINATION_START;
  limit: number = Constants.DEFAULT_PAGINATION_LIMIT;
  jobsCount : number;
  searchText: string = ''
  jobs: Array<IJob> = [];
  currentJob: IJob;

  constructor(private jobService: JobService, public dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router) { 
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
    this.jobService.getEmployerJobs(params).subscribe(res => {
      this.jobs = res.jobs;
      this.jobsCount = res.totalResults;
      this.currentJob  = this.jobs[0];
    },
    (err) => {
      console.log("Error while retreiving records");
      console.log(err);
    })
  }

  openDeleteDialog(id): void {
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '250px' 
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteJob(this.currentJob._id);
      }
    });
  }

  editJob(id){
    this.router.navigateByUrl('/employer/createJob',{state: {data: this.currentJob}});
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '',{
      duration: 2000,
      horizontalPosition: 'right'
    })
  }
  deleteJob(id){
    this.jobService.delete(id).subscribe(res =>{
      this.openSnackBar('Job Deleted Successfully!');
      this.getJobs();
    },(err) => {
      this.openSnackBar('Job Delete Failed!');
    })
  }

  setCurrentJob(job){
    this.currentJob = job;
  }

}
