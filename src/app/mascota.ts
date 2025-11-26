import { Usuario } from "./usuario";

export interface Mascota {
    id?: number;
    nombre: string;
    clase: string;
    peso: number;
    edad: number;
    usuarioId?: number;   // lo envías al backend al crear/editar
    usuario?: Usuario;    // lo recibís del backend al listar
}
