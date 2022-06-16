export interface Paciente {
    idDb?: string;
    uid: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    obraSocial: string;
    email: string;
    password: string;
    foto1: string;
    foto2: string;
    activo: boolean;
    rol: string;
}
