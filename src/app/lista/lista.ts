import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MascotasService } from '../mascotas';
import { Mascota } from "../mascota";
import { UsuariosService } from "../usuarios";
import { Usuario } from "../usuario";

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.html',
  styleUrls: ['./lista.css'],
})
export class Lista implements OnInit {
  mascotas: Mascota[] = []; // Contiene todas las mascotas.
  mascotasFiltradas: Mascota[] = []; // Contiene la lista de mascotas visibles.
  mascotaSeleccionada: Mascota | null = null; // Mascota seleccionada para edición.

  nombre: string | undefined;
  clase: string | undefined;
  peso: number | undefined;
  edad: number | undefined;
  usuarios: any;
  usuariosId: number | undefined;
mascota: any;

  constructor(
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService
  ) {}

  private loadMascotas(): void {
    this.mascotasService.getMascotas().subscribe(
      (data) => {
        this.mascotas = data;
        this.mascotasFiltradas = data; // inicia con la lista completa
      },
      (error) => console.error('Error al cargar las mascotas:', error)
    );
  }

  private loadUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => console.error('Error al cargar los usuarios:', error)
    );
  }

  // Añadir mascota.
  ngOnInit(): void {
    this.loadMascotas();
    this.loadUsuarios();
  }

  onSubmit(form: any): void {
    const newMascota: Mascota = {
      nombre: this.nombre ?? '',
      clase: this.clase ?? '',
      peso: this.peso ?? 0,
      edad: this.edad ?? 0,
      usuarioId: this.usuariosId
    };

    this.mascotasService.createMascota(newMascota).subscribe(
      (addedMascota) => {
        this.mascotas.push(addedMascota);
        this.mascotasFiltradas.push(addedMascota);
        console.log('Mascota añadida', addedMascota);
        this.loadMascotas();
      },
      (error) => console.error('Error al agregar la mascota:', error)
    );
  }

  // Seleccionar mascota para edición.
  editarMascota(mascota: Mascota): void {
    this.mascotaSeleccionada = { ...mascota }; // Clona la mascota seleccionada para evitar modificar el array original.
  }

  // Actualizar mascota.
  actualizarMascota(): void {
    if (this.mascotaSeleccionada) {
      if (this.mascotaSeleccionada.id === undefined) {
        console.error('Error: La mascota seleccionada no tiene un id definido.');
        return;
      }
      this.mascotasService.updateMascota(this.mascotaSeleccionada.id!, this.mascotaSeleccionada).subscribe(
        (updatedMascota) => {

          // Actualiza la lista local con los datos actualizados.
          const index = this.mascotas.findIndex(m => m.id === updatedMascota.id);
          if (index !== -1) {
            this.mascotas[index] = updatedMascota;
            this.mascotasFiltradas[index] = updatedMascota;
          }
          console.log('Mascota actualizada', updatedMascota);
          this.mascotaSeleccionada = null; // Cierra el formulario de edición.
          this.loadMascotas(); 
        },
        (error) => console.error('Error al actualizar la mascota:', error)
      );
    }
  }

  // Eliminar mascota.
  deleteMascota(id: number): void {
    this.mascotasService.deleteMascota(id).subscribe(
      () => {
        this.mascotas = this.mascotas.filter(mascota => mascota.id !== id);
        this.mascotasFiltradas = this.mascotasFiltradas.filter(mascota => mascota.id !== id);
        console.log(`Mascota con ID ${id} eliminada`);
      },
      (error) => console.error('Error al eliminar la mascota:', error)
    );
  }
}