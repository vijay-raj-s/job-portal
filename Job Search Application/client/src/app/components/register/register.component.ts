import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { EmpAuthenticationService } from 'src/app/services/emp-authentication.service';
import { JsAuthenticationService } from 'src/app/services/js-authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  public registerForm : FormGroup; 

  
  isJobseeker: boolean = false
  
  
  passwordNotMatch: boolean = false;

  constructor(
    private jsAuthenticationService : JsAuthenticationService,
    private empAuthenticationService : EmpAuthenticationService,
    private router : Router,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required]),
      name : new FormControl('', [Validators.required]),
      confirmPassword  : new FormControl('', [Validators.required])
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '',{
      duration: 2000,
      horizontalPosition: 'right'
    })
  }
  
  public hasError = (controlName: string, errorName: string) =>{
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  register(registerForm){
    this.registerForm.markAllAsTouched(); 
    if (!this.registerForm.valid) {
      return;
    }
    if(registerForm.password !== registerForm.confirmPassword){
      this.passwordNotMatch = true;
      return;
    }
    let user: any = {};
    user = { 
        "email" : registerForm.email,
        "password" : registerForm.password 
    };

    if(this.isJobseeker){
      user.jobSeekerName = registerForm.name;
      this.jsAuthenticationService.signup(user).subscribe(res => { 
        this.openSnackBar("Registration Successful");
        this.router.navigateByUrl('/login');
      },
      (err) => {
        debugger;
        console.log(err);
      });
    }else{
      user.employerName = registerForm.name;
      user.companyName = registerForm.name;
      this.empAuthenticationService.signup(user).subscribe(res => {
        this.router.navigateByUrl('/login');
      },
      (err) => {
        console.log(err);
      });
    }
  }

  userTypeSwap(){
    this.isJobseeker = !this.isJobseeker;
  }
}
