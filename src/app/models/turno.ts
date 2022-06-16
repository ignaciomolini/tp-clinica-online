import { Especialidad } from "./especialidad";
import { Especialista } from "./especialista";
import { Paciente } from "./paciente";

export interface Turno {
    idDb?: string;
    especialista: Especialista;
    paciente: Paciente;
    especialidad: Especialidad;
    estado: string;
    fecha: number;
}
