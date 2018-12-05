import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevicePage } from './add-device.page';

describe('AddDevicePage', () => {
  let component: AddDevicePage;
  let fixture: ComponentFixture<AddDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDevicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
