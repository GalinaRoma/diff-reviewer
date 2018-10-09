import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSideBySideComponent } from './modal-side-by-side.component';

describe('ModalSideBySideComponent', () => {
  let component: ModalSideBySideComponent;
  let fixture: ComponentFixture<ModalSideBySideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSideBySideComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSideBySideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
