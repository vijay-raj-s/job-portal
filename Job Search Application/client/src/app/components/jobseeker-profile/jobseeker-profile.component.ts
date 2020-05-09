import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JsAuthenticationService } from 'src/app/services/js-authentication.service';

@Component({
  selector: 'app-jobseeker-profile',
  templateUrl: './jobseeker-profile.component.html',
  styleUrls: ['./jobseeker-profile.component.sass']
})
export class JobseekerProfileComponent implements OnInit {

  public profileForm : FormGroup; 

  constructor(private jsAuthService: JsAuthenticationService) { 
    jsAuthService.getDetails().subscribe(response => {
      let res : any = response;
      const {jobSeekerName, designation, email, contact, experience} = res;
      this.profileForm.patchValue({
        jobSeekerName,
        designation,
        email,
        contact,
        experience
      }); 
    },(err) => {
      console.log("error getting user profile details")
      console.log(err);
    })
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      jobSeekerName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      resume: new FormControl(''),
      designation: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl(''),
      experience: new FormControl('')
    }); 
  }

  hasError = (controlName: string, errorName: string) =>{
    return this.profileForm.controls[controlName].hasError(errorName);
  }

  updateProfile(profileForm){
    this.jsAuthService.update(profileForm).subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log("Error updating Job Seeker profile")
    })
  }

  clear(){
    this.profileForm.reset();
  }

}
