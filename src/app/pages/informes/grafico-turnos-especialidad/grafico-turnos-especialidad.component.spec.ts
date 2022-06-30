import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosEspecialidadComponent } from './grafico-turnos-especialidad.component';

describe('GraficoTurnosEspecialidadComponent', () => {
  let component: GraficoTurnosEspecialidadComponent;
  let fixture: ComponentFixture<GraficoTurnosEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoTurnosEspecialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoTurnosEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
