export interface Administrador {
    idDb?: string;
    uid?: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    password: string;
    foto: string;
    activo: boolean;
    rol: string;
}
