import { TestBed } from '@angular/core/testing';

import { InfoApiService } from './info-api.service';

describe('InfoApiService', () => {
  let service: InfoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
