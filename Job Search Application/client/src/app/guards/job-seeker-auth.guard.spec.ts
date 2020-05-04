import { TestBed, async } from '@angular/core/testing';

import { JobSeekerAuthGuard } from './job-seeker-auth.guard'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginAuthGuard', () => {
  let guard: JobSeekerAuthGuard;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [JobSeekerAuthGuard]
    })
    .compileComponents();
    guard = TestBed.inject(JobSeekerAuthGuard);
  }));
   

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
