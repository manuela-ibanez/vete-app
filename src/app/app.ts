import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu';
import { LogoComponent } from './logo/logo';
import { FooterComponent } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    LogoComponent,
    FooterComponent
    // Lista ← NO lo incluyas aquí, se carga por el router
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }