import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'; 
import { LogoutComponent } from './components/logout/logout.component';
import { JobSeekerAuthGuard } from './guards/job-seeker-auth.guard';
import { EmployerHomeComponent } from './components/employer/employer-home/employer-home.component';
import { JobSeekerComponent } from './components/job-seeker/job-seeker.component';
import { EmployerComponent } from './components/employer/employer.component';
import { EmployerAuthGuard } from './guards/employer-auth.guard';
import { SearchComponent } from './components/search/search.component';
import { InterviewsComponent } from './components/interviews/interviews.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { EmployerApplicationsComponent } from './components/employer-applications/employer-applications.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { EmployerInterviewsComponent } from './components/employer-interviews/employer-interviews.component';


const routes: Routes = [
  {
    path: 'jobseeker',
    component: JobSeekerComponent,
    children: [
      {
        path:'',
        redirectTo: 'search',
        pathMatch: 'full' 
      },
      {
        path: 'search', 
        component: SearchComponent 
      },
      {
        path: 'applications',
        component: ApplicationsComponent,
        canActivate: [JobSeekerAuthGuard] 
      },
      {
        path: 'interviews',
        component: InterviewsComponent,
        canActivate: [JobSeekerAuthGuard] 
      }
    ]
  },
  {
    path: 'employer',
    component: EmployerComponent,
    canActivate: [EmployerAuthGuard],
    children: [
      {
        path:'',
        redirectTo: 'applications',
        pathMatch: 'full' 
      },
      {
        path: 'applications', 
        component: EmployerApplicationsComponent,
        canActivate: [EmployerAuthGuard] 
      },
      {
        path: 'createJob',
        component: PostJobComponent,
        canActivate: [EmployerAuthGuard] 
      },
      {
        path: 'interviews',
        component: EmployerInterviewsComponent,
        canActivate: [EmployerAuthGuard] 
      }
    ]
  },  
  {
    path: 'employer/home',
    component: EmployerHomeComponent,
    canActivate: [EmployerAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }, 
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [JobSeekerAuthGuard]
  },
  { path: '',
    redirectTo: '/jobseeker',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
