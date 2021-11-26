import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbToastGlobalComponent } from './ngb-toast-global.component';

describe('NgbToastGlobalComponent', () => {
  let component: NgbToastGlobalComponent;
  let fixture: ComponentFixture<NgbToastGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbToastGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbToastGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
