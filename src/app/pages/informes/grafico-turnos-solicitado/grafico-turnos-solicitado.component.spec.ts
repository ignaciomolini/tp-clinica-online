import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosSolicitadoComponent } from './grafico-turnos-solicitado.component';

describe('GraficoTurnosSolicitadoComponent', () => {
  let component: GraficoTurnosSolicitadoComponent;
  let fixture: ComponentFixture<GraficoTurnosSolicitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoTurnosSolicitadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoTurnosSolicitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
