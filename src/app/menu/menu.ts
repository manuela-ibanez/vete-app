import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // ← IMPORTANTE
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent { }