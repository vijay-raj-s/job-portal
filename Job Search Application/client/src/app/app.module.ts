import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LogoutComponent } from './components/logout/logout.component';
import { EmployerHomeComponent } from './components/employer/employer-home/employer-home.component';
import { EmployerComponent } from './components/employer/employer.component';
import { JobSeekerComponent } from './components/job-seeker/job-seeker.component';
import { JobSeekerAuthGuard } from './guards/job-seeker-auth.guard';
import { MaterialModule } from './material.module';
import { SearchComponent } from './components/search/search.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { InterviewsComponent } from './components/interviews/interviews.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployerAuthGuard } from './guards/employer-auth.guard';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    LogoutComponent,
    EmployerHomeComponent,
    EmployerComponent,
    JobSeekerComponent,
    SearchComponent,
    ApplicationsComponent,
    InterviewsComponent
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
  providers: [JobSeekerAuthGuard, EmployerAuthGuard, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
