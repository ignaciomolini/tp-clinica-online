import { Encuesta } from "./encuesta";
import { Especialidad } from "./especialidad";
import { Especialista } from "./especialista";
import { HistoriaClinica } from "./historia-clinica";
import { Paciente } from "./paciente";

export enum estadoTurno{
    pendiente = 'pendiente',
    aceptado = 'aceptado',
    cancelado = 'cancelado',
    rechazado = 'rechazado',
    finalizado = 'finalizado'
}

export interface Turno {
    idDb?: string;
    especialista: Especialista;
    paciente: Paciente;
    especialidad: Especialidad;
    estado: estadoTurno;
    fecha: number;
    comentarioRechazo?: string;
    comentarioCancelacion?: string;
    comentarioAtencion?: string;
    resenia?: string;
    encuesta?: Encuesta;
    historiaClinica?: HistoriaClinica;
}
