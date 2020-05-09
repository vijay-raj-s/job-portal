import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EmpAuthenticationService } from 'src/app/services/emp-authentication.service';
@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.sass']
})
export class EmployerProfileComponent implements OnInit {

  public profileForm : FormGroup; 

  constructor(private empAuthService: EmpAuthenticationService) {
    this.getPersonalDetails();
   }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      employerName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      companyName: new FormControl('', [Validators.required]), 
      companyLogo: new FormControl(''),
      companyUrl: new FormControl(''),
      location: new FormControl(''),  
      email: new FormControl('', [Validators.required]),
      contact: new FormControl('')
    }); 
  }

  getPersonalDetails(){
    this.empAuthService.getDetails().subscribe(response =>{
      let res : any = response;
      const {employerName, companyName, email, contact, location, companyUrl} = res;
      this.profileForm.patchValue({
        employerName,
        companyName,
        email,
        contact,
        location,
        companyUrl
      });
    },(err) =>{
      console.log("error getting employer personal details");
    })
  }

  hasError = (controlName: string, errorName: string) =>{
    return this.profileForm.controls[controlName].hasError(errorName);
  }

  updateProfile(profileForm){
    this.empAuthService.update(profileForm).subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log("Error updating Employer profile")
    })
  }

  clear(){
    this.profileForm.reset();
  }
}
