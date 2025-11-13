import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/user-service';
import { User } from '../../model/user';

@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-usuario.html',
  styleUrl: './registrar-usuario.css',
})
export class RegistrarUsuario {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  user: User = new User();
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  onRegister(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.user.fecha_creacion = new Date();
    this.user.fecha_actualizacion = new Date();

    //id=0 puede impedir persistir como nuevo en el backend
    (this.user as any).id = null;

    this.usuarioService.save(this.user).subscribe({
      next: (savedUser: User) => {
        this.loading = false;
        this.successMessage = 'Usuario registrado exitosamente';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al registrar usuario:', error);

        if (error?.status === 409) {
          this.errorMessage = 'El usuario o correo ya existe';
        } else if (error?.status === 500) {
          const errorMsg = error?.error?.message || error?.message || '';

          if (errorMsg.includes('usuario_celular_key') || errorMsg.includes('celular')) {
            this.errorMessage = 'Este número de celular ya está registrado';
          } else if (errorMsg.includes('usuario_username_key') || errorMsg.includes('username')) {
            this.errorMessage = 'Este nombre de usuario ya está en uso';
          } else if (errorMsg.includes('usuario_correo_key') || errorMsg.includes('correo')) {
            this.errorMessage = 'Este correo electrónico ya está registrado';
          } else {
            this.errorMessage = 'Error en el servidor. El usuario no pudo ser creado.';
          }
        } else if (error?.status === 400) {
          this.errorMessage = 'Datos inválidos. Verifica el formulario.';
        } else {
          this.errorMessage = 'Error al registrar usuario. Intente nuevamente';
        }
      }
    });
  }

  validateForm(): boolean {
    // Validar campos vacíos
    if (!this.user.username || !this.user.correo || !this.user.nombres ||
        !this.user.apellidos || !this.user.celular) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return false;
    }

    // Validar contraseña
    if (!this.user.password || this.user.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    // Validar confirmación de contraseña
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.correo.toString())) {
      this.errorMessage = 'Ingrese un correo válido';
      return false;
    }

    // Validar celular (ahora es string)
    if (!this.user.celular || this.user.celular.trim().length === 0) {
      this.errorMessage = 'Ingrese un número de celular válido';
      return false;
    }

    // Validar username
    if (this.user.username.length < 3) {
      this.errorMessage = 'El usuario debe tener al menos 3 caracteres';
      return false;
    }

    return true;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
