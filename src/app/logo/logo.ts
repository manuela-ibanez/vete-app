import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo.
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class LogoComponent {

}