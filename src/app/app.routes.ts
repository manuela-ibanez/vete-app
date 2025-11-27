import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Lista } from './lista/lista';
import { ListaUsuarios } from './lista-usuarios/lista-usuarios';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'mascotas', component: Lista },
  { path: 'usuarios', component: ListaUsuarios },
  { path: '**', redirectTo: '/home' }
];