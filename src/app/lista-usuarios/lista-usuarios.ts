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
  imports: [RouterLink, FormsModule, CommonModule],  // ← AGREGAR FormsModule y CommonModule
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
    // Validar que todos los campos estén completos
    if (!this.nombre || !this.apellido || !this.email || 
        !this.mascotaNombre || !this.mascotaClase || 
        !this.mascotaPeso || !this.mascotaEdad) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // Crear el objeto con usuario y mascota
    const nuevoUsuarioConMascota = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      mascotas: [
        {
          nombre: this.mascotaNombre,
          clase: this.mascotaClase,
          peso: this.mascotaPeso,
          edad: this.mascotaEdad
        }
      ]
    };

    console.log('Enviando:', nuevoUsuarioConMascota);

    this.usuariosService.createUsuario(nuevoUsuarioConMascota).subscribe(
      (addedUsuario: any) => {
        console.log('Usuario con mascota añadido', addedUsuario);
        
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
        alert('Error al crear el usuario. Revisa la consola.');
      }
    );
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  actualizarUsuario(): void {
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      this.usuariosService.updateUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe(
        (updatedUsuario: Usuario) => {
          const index = this.usuarios.findIndex(u => u.id === updatedUsuario.id);
          if (index !== -1) {
            this.usuarios[index] = updatedUsuario;
            this.usuariosFiltrados[index] = updatedUsuario;
          }
          console.log('Usuario actualizado', updatedUsuario);
          this.usuarioSeleccionado = null;
          this.loadUsuarios();
        },
        (error: any) => console.error('Error al actualizar el usuario:', error)
      );
    }
  }

  deleteUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario y todas sus mascotas?')) {
      this.usuariosService.deleteUsuario(id).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          this.usuariosFiltrados = this.usuariosFiltrados.filter(usuario => usuario.id !== id);
          console.log(`Usuario con ID ${id} eliminado`);
        },
        (error: any) => console.error('Error al eliminar el usuario:', error)
      );
    }
  }
}