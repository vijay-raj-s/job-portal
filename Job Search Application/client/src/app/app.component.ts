import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  viewProviders: [MatIconRegistry]
})
export class AppComponent {
  title = 'job-search-client';
}
