import { TestBed, inject } from '@angular/core/testing';

import { CheckTypeService } from './check-type.service';

describe('CheckTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckTypeService]
    });
  });

  it('should be created', inject([CheckTypeService], (service: CheckTypeService) => {
    expect(service).toBeTruthy();
  }));
});
