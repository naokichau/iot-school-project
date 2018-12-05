import { TestBed } from '@angular/core/testing';

import { IotApiService } from './iot-api.service';

describe('IotApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IotApiService = TestBed.get(IotApiService);
    expect(service).toBeTruthy();
  });
});
