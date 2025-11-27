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
  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  mascotaSeleccionada: Mascota | null = null;

  nombre: string | undefined;
  clase: string | undefined;
  peso: number | undefined;
  edad: number | undefined;
  usuarios: any;
  usuariosId: number | undefined;

  constructor(
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.loadMascotas();
    this.loadUsuarios();
  }

  private loadMascotas(): void {
    this.mascotasService.getMascotas().subscribe(
      (data) => {
        this.mascotas = data;
        this.mascotasFiltradas = data;
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

  onSubmit(form: any): void {
    // El formulario ya valida, pero agregamos validación extra
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      alert('Por favor, completa todos los campos correctamente');
      return;
    }

    // Validaciones adicionales personalizadas
    if (!this.nombre || !this.clase || !this.peso || !this.edad || !this.usuariosId) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.peso <= 0) {
      alert('El peso debe ser mayor a 0');
      return;
    }

    if (this.edad < 0) {
      alert('La edad no puede ser negativa');
      return;
    }

    const newMascota: Mascota = {
      nombre: this.nombre.trim(),
      clase: this.clase.trim(),
      peso: this.peso,
      edad: this.edad,
      usuarioId: this.usuariosId
    };

    this.mascotasService.createMascota(newMascota).subscribe(
      (addedMascota) => {
        console.log('Mascota añadida', addedMascota);
        alert('✅ Mascota creada exitosamente');
        
        // Limpiar formulario
        this.nombre = undefined;
        this.clase = undefined;
        this.peso = undefined;
        this.edad = undefined;
        this.usuariosId = undefined;
        form.resetForm();
        
        // Recargar lista completa desde el backend
        this.loadMascotas();
      },
      (error) => {
        console.error('Error al agregar la mascota:', error);
        alert('❌ Error al crear la mascota. Por favor, intenta nuevamente.');
      }
    );
  }

  editarMascota(mascota: Mascota): void {
    this.mascotaSeleccionada = { ...mascota };
  }

  actualizarMascota(): void {
    if (this.mascotaSeleccionada) {
      if (this.mascotaSeleccionada.id === undefined) {
        console.error('Error: La mascota seleccionada no tiene un id definido.');
        return;
      }

      // Validaciones adicionales
      if (this.mascotaSeleccionada.peso && this.mascotaSeleccionada.peso <= 0) {
        alert('El peso debe ser mayor a 0');
        return;
      }

      if (this.mascotaSeleccionada.edad && this.mascotaSeleccionada.edad < 0) {
        alert('La edad no puede ser negativa');
        return;
      }

      this.mascotasService.updateMascota(this.mascotaSeleccionada.id!, this.mascotaSeleccionada).subscribe(
        (updatedMascota) => {
          const index = this.mascotas.findIndex(m => m.id === updatedMascota.id);
          if (index !== -1) {
            this.mascotas[index] = updatedMascota;
            this.mascotasFiltradas[index] = updatedMascota;
          }
          console.log('Mascota actualizada', updatedMascota);
          alert('✅ Mascota actualizada exitosamente');
          this.mascotaSeleccionada = null;
          this.loadMascotas(); 
        },
        (error) => {
          console.error('Error al actualizar la mascota:', error);
          alert('❌ Error al actualizar la mascota');
        }
      );
    }
  }

  deleteMascota(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta mascota?')) {
      this.mascotasService.deleteMascota(id).subscribe(
        () => {
          this.mascotas = this.mascotas.filter(mascota => mascota.id !== id);
          this.mascotasFiltradas = this.mascotasFiltradas.filter(mascota => mascota.id !== id);
          alert('✅ Mascota eliminada exitosamente');
          console.log(`Mascota con ID ${id} eliminada`);
        },
        (error) => {
          console.error('Error al eliminar la mascota:', error);
          alert('❌ Error al eliminar la mascota');
        }
      );
    }
  }
}