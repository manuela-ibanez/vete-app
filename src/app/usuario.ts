import { Mascota } from "./mascota";

export interface Usuario {
    id?: number;  // ← Opcional porque se genera en el backend
    nombre: string;
    email: string;
    apellido: string;
    mascotas?: Mascota[];  // ← Array de mascotas (no mascotaId ni mascota)
}