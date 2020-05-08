import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerInterviewsComponent } from './employer-interviews.component';

describe('EmployerInterviewsComponent', () => {
  let component: EmployerInterviewsComponent;
  let fixture: ComponentFixture<EmployerInterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerInterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
