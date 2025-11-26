import { Routes } from '@angular/router';
import { Lista } from './lista/lista';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  //{ path: 'home', component: Lista },  // ← descomentá esto
  { path: 'mascotas', component: Lista },  // ← esto carga lo mismo
  { path: '**', redirectTo: '/home' }
];