import { CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MascotasService } from '../services/mascotas';
import { Mascota } from "../interfaces/mascota";
import { UsuariosService } from "../services/usuarios";

@Component({
  selector: 'app-lista',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo.
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './lista.html',
  styleUrls: ['./lista.css'],
})


export class Lista implements OnInit {
  protected mascotas: Mascota[] = []; // Lista completa de mascota, arreglo vacio

// Datos del formulario para nueva mascota
  protected nombre: string | undefined;  //Cuando se cambian en el html se actualizan en el ts
  protected clase: string | undefined;
  protected peso: number | undefined;
  protected edad: number | undefined;
  protected usuarios: any;
  protected usuarioId: number | undefined;
  protected editarMascotaId: any | undefined;


  constructor( // Inyectar el servicio de mascotas y usuarios
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void { // Cargar datos iniciales
    this.loadMascotas();
    this.loadUsuarios();
  }

  private loadMascotas(): void { // Componente que carga las mascotas desde el servicio
    this.mascotasService.getAll().subscribe(
      (data) => {
        this.mascotas = data; //Mascotas es la lista de mascotas
      },
      (error) => {
        console.error('Error al cargar las mascotas:', error)
      }
    );
  }

  private loadUsuarios(): void { // Componente que carga los usuarios desde el servicio
    this.usuariosService.getAll().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error)
      }
    );
  }

  createMascota(form: any): void { //Se ejecuta al enviar un formulario.
    const newMascota: any = {
      nombre: form.value.nombre,
      clase: form.value.clase,
      peso: form.value.peso,
      edad: form.value.edad,
      usuarioId: form.value.usuarioId,
    }

    // Llamar al servicio para crear la mascota
    this.mascotasService.createMascota(newMascota).subscribe(
      (addedMascota) => {
        this.mascotas.push(addedMascota);
        console.log('Mascota añadida', addedMascota);
        alert('✅ Mascota creada exitosamente');
        
        // Limpiar formulario
        form.reset();
        
        // Recargar lista completa desde el backend
        this.loadMascotas();
      },
      (error) => {
        console.error('Error al agregar la mascota:', error);
        alert('❌ Error al crear la mascota');
      }
    );
  }

  editMascota (id:number): void{
    if (this.editarMascotaId === id){
      this.editarMascotaId = null;
      return;
    }
    this.editarMascotaId = id;
    console.log('Edit mascota with id:', id);
  }

  updateMascota (form: any): void {
    this.mascotasService.updateMascota(form.value.id, {
      nombre: form.value.nombre,
      clase:form.value.clase,
      peso:form.value.peso,
      edad:form.value.edad,
    }).subscribe(
      (updateMascota) => {
        const index = this.mascotas.findIndex(mascota => mascota.id === updateMascota.id);
        if (index !== -1){
          this.mascotas[index] = updateMascota;
        }
        console.log ('Mascota update:', updateMascota);
        this.editarMascotaId = null;
      },
    (error) => {
      console.log ('Ocurrio un error al actualizar la mascota', error);
    }
  );
}

  //Elimina la mascota
  deleteMascota(id: number): void { //Se ejecuta al tocal el boton eliminar. Solo recibe el ID de la mascota.
    alert ('¿Estás seguro de eliminar esta mascota?');
      this.mascotasService.deleteMascota(id).subscribe( //Llama al servicio para eliminar
        () => {
          this.mascotas = this.mascotas.filter(mascota => mascota.id !== id);
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