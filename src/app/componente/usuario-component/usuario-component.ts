import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { User } from '../../model/user';
import { UsuarioService } from '../../services/user-service';

@Component({
  selector: 'app-usuario-component',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './usuario-component.html',
  styleUrl: './usuario-component.css',
})
export class UsuarioComponent implements OnInit {
  usuarios: User[] = [];
  filteredUsuarios: User[] = [];
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: data => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        console.log('Fetched users:', this.usuarios); // Log the fetched data

        // Fetch usernames dynamically for each user
        this.usuarios.forEach(user => {
          this.usuarioService.findUsername(user.id!).subscribe({
            next: username => {
              user.username = username;
              console.log(`Fetched username for user ID ${user.id}:`, username);
            },
            error: err => console.error(`Error fetching username for user ID ${user.id}:`, err)
          });
        });
      },
      error: err => console.error('Error al obtener usuarios', err)
    });
  }

  onBuscar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const texto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      return texto.includes(valor);
    });
  }

  fetchUsername(userId: number): void {
    this.usuarioService.findUsername(userId).subscribe({
      next: username => {
        const user = this.usuarios.find(u => u.id === userId);
        if (user) {
          user.username = username;
        }
      },
      error: err => console.error(`Error fetching username for user ID ${userId}:`, err)
    });
  }

  verDetalle(usuarioId?: number): void {
    if (usuarioId == null) {
      return;
    }
    const user = this.usuarios.find(u => u.id === usuarioId);
    console.log('Navigating to user info:', user);
    this.router.navigate(['/usuarioinfo', usuarioId]);
  }
}
