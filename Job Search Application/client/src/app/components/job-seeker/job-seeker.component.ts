import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants';

@Component({
  selector: 'app-job-seeker',
  templateUrl: './job-seeker.component.html',
  styleUrls: ['./job-seeker.component.sass']
})
export class JobSeekerComponent implements OnInit {

  isLoggedIn : boolean = false;
  token : string = '';

  constructor() { 
    this.token = localStorage.getItem(Constants.TOKEN);
    if(this.token){
      this.isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    
  }

}
