import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosFinalizadoComponent } from './grafico-turnos-finalizado.component';

describe('GraficoTurnosFinalizadoComponent', () => {
  let component: GraficoTurnosFinalizadoComponent;
  let fixture: ComponentFixture<GraficoTurnosFinalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoTurnosFinalizadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoTurnosFinalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
