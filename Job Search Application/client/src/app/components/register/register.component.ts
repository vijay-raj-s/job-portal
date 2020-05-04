import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  isJobseeker: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  userTypeSwap(){
    this.isJobseeker = !this.isJobseeker;
  }
}
