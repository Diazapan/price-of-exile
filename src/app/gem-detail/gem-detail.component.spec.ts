import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemDetailComponent } from './gem-detail.component';

describe('GemDetailComponent', () => {
  let component: GemDetailComponent;
  let fixture: ComponentFixture<GemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
