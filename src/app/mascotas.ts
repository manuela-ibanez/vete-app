import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from './mascota';

@Injectable({
    providedIn: 'root',
})
export class MascotasService {
    private baseUrl = 'http://localhost:3000/mascotas';

    constructor(private http: HttpClient) {}

  // Traer todas las mascotas.
    getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.baseUrl);
    }

  // Mostrar mascota por su ID.
    getMascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.baseUrl}/${id}`);
    }

  // Crear una mascota.
    createMascota(data: any): Observable<Mascota> {
    return this.http.post<Mascota>(this.baseUrl, data);
    }

  // Actualizar una mascota.
    updateMascota(id: number, data: any): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.baseUrl}/${id}`, data);
    }

  // Eliminar una mascota.
    deleteMascota(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
    }
}