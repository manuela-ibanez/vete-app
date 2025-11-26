import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private readonly apiUrl = 'http://localhost:3000/mascotas'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
