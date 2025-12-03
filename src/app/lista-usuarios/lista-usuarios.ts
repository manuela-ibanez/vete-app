import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { UsuariosService } from '../services/usuarios';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})
export class ListaUsuarios implements OnInit { // Implementar OnInit para inicialización
  usuarios: Usuario[] = []; //Lista de usuarios que le pasa el backend
  usuarioSeleccionado: Usuario | null = null; //Mascota seleccionada

  // Datos del usuario
  nombre: string = '';
  apellido: string = '';
  email: string = '';

  // Datos de la mascota
  mascotaNombre: string = '';
  mascotaClase: string = '';
  mascotaPeso: number | undefined;
  mascotaEdad: number | undefined;
  editarUsuarioId: any | undefined;

  constructor(private usuariosService: UsuariosService) {} // Inyectar el servicio de usuarios

  ngOnInit(): void { // Cargar datos iniciales desde el backend, a traves de ls services 
    this.loadUsuarios();
  }

  private loadUsuarios(): void { //Cuando el componente se inicie, llamar a loadUsuarios() para traer los usuarios del backend.
    this.usuariosService.getAll().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => console.error('Error al cargar los usuarios:', error)
    );
  }

  createUsuario(form: any): void { //Para formulario
    // Crear el objeto con usuario y mascota
    const nuevoUsuarioConMascota = {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email,
      mascotas: [
        {
          nombre: form.value.mascotaNombre,
          clase: form.value.mascotaClase,
          peso: form.value.mascotaPeso,
          edad: form.value.mascotaEdad
        }
      ]
    };

    // Llamar al servicio para crear usuario con mascota
    this.usuariosService.createUsuario(nuevoUsuarioConMascota).subscribe( //cuando el usuario aprieta el boton crear
      (addedUsuario) => {
        console.log('Usuario con mascota añadido', addedUsuario);
        alert('✅ Usuario y mascota creados exitosamente');
        
        // Limpiar formulario
        form.reset();
        this.loadUsuarios();
      },
      (error) => { //manejo de errores
        console.error('Error al agregar el usuario:', error);
        alert('❌ Error al crear el usuario. Por favor, intenta nuevamente.');
      }
    );
  }

  editUsuario (id:number): void{
    if (this.editarUsuarioId === id){
      this.editarUsuarioId = null;
      return;
    }
    this.editarUsuarioId = id;
    console.log('Edit usuario with id:', id);
  }

  updateUsuario (form: any): void {
    this.usuariosService.updateUsuario(form.value.id, {
      nombre: form.value.nombre,
      apellido:form.value.apellido,
      email:form.value.email,
    }).subscribe(
      (updateUsuario) => {
        const index = this.usuarios.findIndex(usuario => usuario.id === updateUsuario.id);
        if (index !== -1){
          this.usuarios[index] = updateUsuario;
        }
        console.log ('Usuario update:', updateUsuario);
        this.editarUsuarioId = null;
      },
    (error) => {
      console.log ('Ocurrio un error al actualizar el usuario', error);
    }
  );
}

 //Eliminar usuario
  deleteUsuario(id: number): void { //Se ejecuta al tocal el boton eliminar. Solo recibe el ID del usuario.
    alert ('¿Estás seguro de eliminar este usuario?');
      this.usuariosService.deleteUsuario(id).subscribe( //Llama al servicio para eliminar
        () => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          alert('✅ Usuario eliminado exitosamente');
          console.log(`Usuario con ID ${id} eliminado`);
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
          alert('❌ Error al eliminar el usuario');
        }
      );
    }
  }