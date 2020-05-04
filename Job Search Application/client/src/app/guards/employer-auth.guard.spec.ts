import { TestBed } from '@angular/core/testing';

import { EmployerAuthGuard } from './employer-auth.guard';

describe('EmployerAuthGuard', () => {
  let guard: EmployerAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmployerAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
