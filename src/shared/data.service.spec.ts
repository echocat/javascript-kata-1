import { TestBed } from '@angular/core/testing';

import { LiteratureService } from './literature.service';

describe('DataService', () => {
  let service: LiteratureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiteratureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
