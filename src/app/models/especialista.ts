import { Especialidad } from "./especialidad";

export interface Especialista {
    idDb?: string;
    uid: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    password: string;
    foto: string;
    activo: boolean;
    especialidad: Especialidad[];
    rol: string;
}
