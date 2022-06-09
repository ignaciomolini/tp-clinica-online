import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEspecialistaComponent } from './form-especialista.component';

describe('FormEspecialistaComponent', () => {
  let component: FormEspecialistaComponent;
  let fixture: ComponentFixture<FormEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEspecialistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
