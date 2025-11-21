import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  // Traer todos los usuarios.
  getUsuarios(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Traer un usuario por una ID.
  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Crear un usuario.
  createUsuario(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Actualizar un usuario con su ID.
  updateUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // eliminar un usuario.
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
