import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true, //No depende de un modulo
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  year = new Date().getFullYear(); // Obtener el año actual.
} 