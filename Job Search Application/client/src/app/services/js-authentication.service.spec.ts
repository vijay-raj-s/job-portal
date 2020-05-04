import { TestBed } from '@angular/core/testing';

import { JsAuthenticationService } from './js-authentication.service';

describe('JsAuthenticationService', () => {
  let service: JsAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
