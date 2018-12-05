import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRecordPage } from './data-record.page';

describe('DataRecordPage', () => {
  let component: DataRecordPage;
  let fixture: ComponentFixture<DataRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRecordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
