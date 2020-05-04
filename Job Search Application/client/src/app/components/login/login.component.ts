import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/iuser';
import { JsAuthenticationService } from 'src/app/services/js-authentication.service';
import { EmpAuthenticationService } from 'src/app/services/emp-authentication.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  isJobseeker: boolean = true;
  user : IUser;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);


  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
      return this.password.hasError('required') ? 'You must enter a value' :'';
  }
  
  

  constructor(private jsAuthenticationService : JsAuthenticationService, private empAuthenticationService : EmpAuthenticationService, private router : Router) { }

  ngOnInit(): void {
    this.user = {
      email : '',
      password: ''
    }
  }

  userTypeSwap(){
    this.isJobseeker = !this.isJobseeker;
  }

  login(){
    this.user.email = this.email.value;
    this.user.password = this.password.value;
    if(this.isJobseeker){

      this.jsAuthenticationService.login(this.user).subscribe(res => {
        let response : any = res;
        this.jsAuthenticationService.setToken(response.token, response.id);
        this.router.navigateByUrl('/jobseeker');

      },
      (err) => {
        debugger;
        console.log(err);
      });
    }else{
      this.empAuthenticationService.login(this.user).subscribe(res => {
        let response : any = res;
        this.empAuthenticationService.setToken(response.token, response.id);
        this.router.navigateByUrl('/employer');
      },
      (err) => {
        console.log(err);
      });
    }
  }

}
