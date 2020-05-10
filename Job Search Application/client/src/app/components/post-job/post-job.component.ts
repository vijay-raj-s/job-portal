import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { IJob } from 'src/app/interfaces/ijob';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { JobService } from 'src/app/services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.sass']
})
export class PostJobComponent implements OnInit {
  public jobForm : FormGroup; 

  jobSkills : Array<string> = [];
  expectations : Array<string> = [];
  tasks : Array<string> = [];
  languages : Array<string> = [];
  expectation: string;
  task: string;
  skill: string;
  isEdit: boolean = false;
  editJob: any = {}
  jobTypeOptions: ['Part-time', 'Full-time','Internship', 'Working student']

  constructor(private jobService: JobService, private _snackBar: MatSnackBar, private router: Router) { 
    if(window.history.state.data){
      this.isEdit = true; 
      this.editJob = window.history.state.data;
      this.jobSkills = this.editJob.skills;
      this.languages = this.editJob.languages;
      this.expectation = this.editJob.expectations;
      this.tasks = this.editJob.tasks; 
    }

  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '',{
      duration: 2000,
      horizontalPosition: 'right'
    })
  }

  ngOnInit(): void {
    this.jobForm = new FormGroup({
      jobTitle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      jobType: new FormControl('', [Validators.required]), 
      jobDescription: new FormControl('', [Validators.maxLength(500)]),
      tasks: new FormControl(''),
      location: new FormControl('', [Validators.required]),  
      aboutUs: new FormControl(''),
      expectations: new FormControl(''),
      skills: new FormControl(''),
      languages: new FormControl('')
    });

    let {jobTitle, jobType, jobDescription, location, aboutUs} = this.editJob;
    this.jobForm.patchValue({
        jobTitle,
        jobType,
        jobDescription,
        location,  
        aboutUs
      });

  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.jobForm.controls[controlName].hasError(errorName);
  }

  createJob = (jobFormValue, isUpdate) => {
    this.jobForm.markAllAsTouched(); 
    if (this.jobForm.valid) {
      this.executeJobCreation(jobFormValue, isUpdate);
    }
  }
 

  executeJobCreation = (jobFormValue, isUpdate) => {
    let job: IJob = {
      jobTitle: jobFormValue.jobTitle,
      jobType: jobFormValue.jobType,
      location: jobFormValue.location,
      jobDescription: jobFormValue.jobDescription,
      skills: this.jobSkills,
      languages: this.languages,
      expectations: this.expectations,
      tasks: this.tasks,
      aboutUs: jobFormValue.aboutUs
    }

    if(!isUpdate){
      this.jobService.postJob(job).subscribe(response =>{
        this.openSnackBar('Job Posted Successfully!');
        this.clear();
      },
      (err) =>{
        console.log(`Error Saving Job ${err}`);
      })
    }else{
      let jobId = this.editJob._id;
      this.jobService.updateJob(job, jobId).subscribe(response =>{
        this.openSnackBar('Job Posted Successfully!');
        this.clear();
        this.router.navigateByUrl('/employer/jobs')
      },
      (err) =>{
        console.log(`Error Saving Job ${err}`);
      })
    }
    
    
  }

  addToList(value: string, listType: string){
    switch (listType) {
      case 'tasks':
        this.checkAndAdd(value, this.tasks);  
      break;
      case 'expectations':
        this.checkAndAdd(value, this.expectations)
      break;
      case 'skills':
        this.checkAndAdd(value, this.jobSkills)
      break;
      case 'languages':
        this.checkAndAdd(value, this.languages)
      break; 
      default:
        break;
    }
    this.jobForm.patchValue({
      [listType] : ''
    })
  }

  deleteListItem(index,listType){
    switch (listType) {
      case 'tasks':
        this.removeItem(index, this.tasks);  
      break;
      case 'expectations':
        this.removeItem(index, this.expectations)
      break;
      case 'skills':
        this.removeItem(index, this.jobSkills)
      break;
      case 'languages':
        this.removeItem(index, this.languages)
      break; 
      default:
        break;
    }
  }

  removeItem(index, list){
      list.splice(index,1);
  } 

  checkAndAdd(value, list){
    if(!list.includes(value) && value != ''){
      list.push(value);
    }
  } 
 
  clear(){
    this.jobForm.reset();
    this.jobSkills = [];
    this.languages = [];
    this.tasks = [];
    this.expectations = [];
  }
}
