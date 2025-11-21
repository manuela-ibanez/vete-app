import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private baseUrl = 'http://localhost:3000/mascotas';

  constructor(private http: HttpClient) {}

  // Traer todas las mascotas.
  getMascotas(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Mostrar mascota por su ID.
  getMascota(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Crear una mascota.
  createMascota(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Actualizar una mascota.
  updateMascota(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar una mascota.
  deleteMascota(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}