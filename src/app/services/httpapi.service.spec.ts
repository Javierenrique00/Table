import { TestBed, inject } from '@angular/core/testing';

import { HttpapiService } from './httpapi.service';

describe('HttpapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpapiService]
    });
  });

  it('should be created', inject([HttpapiService], (service: HttpapiService) => {
    expect(service).toBeTruthy();
  }));
});
