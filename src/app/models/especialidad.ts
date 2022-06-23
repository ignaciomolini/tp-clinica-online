import { Horario } from "./horario";

export interface Especialidad {
    id: number;
    nombre: string;
    imagen?: string;
    horarios?: Horario[];
}
