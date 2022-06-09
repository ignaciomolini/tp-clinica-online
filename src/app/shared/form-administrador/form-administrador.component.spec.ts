import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdministradorComponent } from './form-administrador.component';

describe('FormAdministradorComponent', () => {
  let component: FormAdministradorComponent;
  let fixture: ComponentFixture<FormAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAdministradorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
