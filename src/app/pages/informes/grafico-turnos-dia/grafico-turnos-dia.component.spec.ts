import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosDiaComponent } from './grafico-turnos-dia.component';

describe('GraficoTurnosDiaComponent', () => {
  let component: GraficoTurnosDiaComponent;
  let fixture: ComponentFixture<GraficoTurnosDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoTurnosDiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoTurnosDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
