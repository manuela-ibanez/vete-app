import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../usuario';
import { UsuariosService } from '../usuarios';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})
export class ListaUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;

  // Datos del usuario
  nombre: string = '';
  apellido: string = '';
  email: string = '';

  // Datos de la mascota
  mascotaNombre: string = '';
  mascotaClase: string = '';
  mascotaPeso: number | undefined;
  mascotaEdad: number | undefined;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  private loadUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
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
    if (this.mascotaPeso && this.mascotaPeso <= 0) {
      alert('El peso debe ser mayor a 0');
      return;
    }

    if (this.mascotaEdad && this.mascotaEdad < 0) {
      alert('La edad no puede ser negativa');
      return;
    }

    // Crear el objeto con usuario y mascota
    const nuevoUsuarioConMascota = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      email: this.email.trim().toLowerCase(),
      mascotas: [
        {
          nombre: this.mascotaNombre.trim(),
          clase: this.mascotaClase.trim(),
          peso: this.mascotaPeso,
          edad: this.mascotaEdad
        }
      ]
    };

    this.usuariosService.createUsuario(nuevoUsuarioConMascota).subscribe(
      (addedUsuario: any) => {
        console.log('Usuario con mascota añadido', addedUsuario);
        alert('✅ Usuario y mascota creados exitosamente');
        
        // Limpiar formulario
        this.nombre = '';
        this.apellido = '';
        this.email = '';
        this.mascotaNombre = '';
        this.mascotaClase = '';
        this.mascotaPeso = undefined;
        this.mascotaEdad = undefined;
        form.resetForm();
        
        // Recargar lista
        this.loadUsuarios();
      },
      (error: any) => {
        console.error('Error al agregar el usuario:', error);
        alert('❌ Error al crear el usuario. Por favor, intenta nuevamente.');
      }
    );
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  actualizarUsuario(): void {
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      // Crear objeto solo con los datos que se pueden actualizar
      const usuarioActualizado = {
        nombre: this.usuarioSeleccionado.nombre.trim(),
        apellido: this.usuarioSeleccionado.apellido.trim(),
        email: this.usuarioSeleccionado.email.trim().toLowerCase()
      };

      this.usuariosService.updateUsuario(this.usuarioSeleccionado.id, usuarioActualizado).subscribe(
        (updatedUsuario: Usuario) => {
          const index = this.usuarios.findIndex(u => u.id === updatedUsuario.id);
          if (index !== -1) {
            this.usuarios[index] = updatedUsuario;
            this.usuariosFiltrados[index] = updatedUsuario;
          }
          console.log('Usuario actualizado', updatedUsuario);
          alert('✅ Usuario actualizado exitosamente');
          this.usuarioSeleccionado = null;
          this.loadUsuarios();
        },
        (error: any) => {
          console.error('Error al actualizar el usuario:', error);
          alert('❌ Error al actualizar el usuario');
        }
      );
    }
  }

  deleteUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario y todas sus mascotas?')) {
      this.usuariosService.deleteUsuario(id).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          this.usuariosFiltrados = this.usuariosFiltrados.filter(usuario => usuario.id !== id);
          alert('✅ Usuario eliminado exitosamente');
          console.log(`Usuario con ID ${id} eliminado`);
        },
        (error: any) => {
          console.error('Error al eliminar el usuario:', error);
          alert('❌ Error al eliminar el usuario');
        }
      );
    }
  }
}