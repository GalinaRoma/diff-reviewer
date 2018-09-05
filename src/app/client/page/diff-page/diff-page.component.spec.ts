import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffPageComponent } from './diff-page.component';

describe('DiffPageComponent', () => {
  let component: DiffPageComponent;
  let fixture: ComponentFixture<DiffPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffPageComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
