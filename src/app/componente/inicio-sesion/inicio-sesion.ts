import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/user-service';
import { User } from '../../model/user';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor ingrese usuario y contraseña';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.usuarioService.findByUsername(this.username).subscribe({
      next: (user: User) => {
        this.loading = false;

        if (!user) {
          this.errorMessage = 'Usuario no encontrado';
          return;
        }

        // Validar contraseña
        if (user.password) {
          if (user.password === this.password) {
            // Login exitoso
            const userToSave = { ...user };
            delete userToSave.password;

            localStorage.setItem('currentUser', JSON.stringify(userToSave));
            localStorage.setItem('isLoggedIn', 'true');

            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Usuario o contraseña incorrectos';
          }
        } else {
          this.errorMessage = 'Error: No se puede validar la contraseña';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error('Error en login:', error);
      }
    });
  }

  onRegister(): void {
    // Redirigir a la página de registro
    this.router.navigate(['/registro']);
  }

  clearError(): void {
    this.errorMessage = '';
  }
}

