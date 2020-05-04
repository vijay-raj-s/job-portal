import { TestBed } from '@angular/core/testing';

import { EmpAuthenticationService } from './emp-authentication.service';

describe('EmpAuthenticationService', () => {
  let service: EmpAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
