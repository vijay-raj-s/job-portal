import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { EmployerComponent } from './components/employer/employer.component';
import { JobSeekerComponent } from './components/job-seeker/job-seeker.component';
import { JobSeekerAuthGuard } from './guards/job-seeker-auth.guard';
import { MaterialModule } from './material.module';
import { SearchComponent } from './components/search/search.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { InterviewsComponent } from './components/interviews/interviews.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployerAuthGuard } from './guards/employer-auth.guard';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmployerApplicationsComponent } from './components/employer-applications/employer-applications.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { EmployerInterviewsComponent } from './components/employer-interviews/employer-interviews.component';
import { EmployerProfileComponent } from './components/employer-profile/employer-profile.component';
import { JobseekerProfileComponent } from './components/jobseeker-profile/jobseeker-profile.component';
import { JwtInterceptor } from './jwt.interceptor';
import { DialogComponent } from './components/dialog/dialog.component';
import { DeletedialogComponent } from './components/deletedialog/deletedialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    EmployerComponent,
    JobSeekerComponent,
    SearchComponent,
    ApplicationsComponent,
    InterviewsComponent,
    EmployerApplicationsComponent,
    PostJobComponent,
    EmployerInterviewsComponent,
    EmployerProfileComponent,
    JobseekerProfileComponent,
    DialogComponent,
    DeletedialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, JobSeekerAuthGuard, EmployerAuthGuard, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
