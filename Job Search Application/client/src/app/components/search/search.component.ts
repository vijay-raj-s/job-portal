import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IJob } from 'src/app/interfaces/ijob';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  searchText: string = ''
  jobs: Array<IJob> = [];
  
  constructor(private apiService: ApiService) { 
    this.getJobs();
  }

  ngOnInit(): void {
  }

  getJobs(){
    this.apiService.getAllJobs().subscribe(res => {
      this.jobs = res;
    },
    (err) => {
      console.log("Error while retreiving records");
      console.log(err);
    })
  }


}
