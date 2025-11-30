import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ObjetivoServices } from '../../services/objetivo-services';
import { UsuarioObjetivoServices } from '../../services/usuario-objetivo-services';
import { UsuarioIngestaService } from '../../services/usuario-ingesta-service';
import { Objetivo } from '../../model/objetivo';

@Component({
  selector: 'app-elegir-objetivos-component',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './elegir-objetivos-component.html',
  styleUrls: ['./elegir-objetivos-component.css']
})
export class ElegirObjetivosComponent implements OnInit {

  // 🔹 Datos por defecto para que SIEMPRE aparezcan 3 tarjetas
  listaObjetivos: Objetivo[] = [
    { id: 1, nombre: 'Pérdida de peso' } as Objetivo,
    { id: 2, nombre: 'Mantenimiento' } as Objetivo,
    { id: 3, nombre: 'Volumen muscular' } as Objetivo
  ];

  seleccionado: Objetivo | null = null;

  isSaving = false;
  mensajeExito = '';
  mensajeError = '';

  private objetivoService = inject(ObjetivoServices);
  private usuarioObjetivoService = inject(UsuarioObjetivoServices);
  private usuarioIngestaService = inject(UsuarioIngestaService);
  private router = inject(Router);

  ngOnInit() {
    this.loadObjetivos();
  }

  private loadObjetivos() {
    this.objetivoService.findAll().subscribe({
      next: data => {
        if (data && data.length > 0) {
          this.listaObjetivos = data;
        }
      },
      error: err => {
        console.error('Error al cargar objetivos', err);
        // No rompemos la UI, solo mostramos mensaje y dejamos los 3 por defecto
        this.mensajeError = 'No se pudieron cargar los objetivos desde el servidor. Usando valores por defecto.';
      }
    });
  }

  seleccionarObjetivo(obj: Objetivo) {
    this.seleccionado = obj;
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  guardarObjetivo() {
    if (!this.seleccionado) {
      this.mensajeError = 'Debes seleccionar un objetivo.';
      return;
    }

    const userId = this.extractUserIdFromToken(localStorage.getItem('token'));
    if (!userId) {
      this.mensajeError = 'No se pudo obtener el usuario del token. Inicia sesión nuevamente.';
      return;
    }

    this.isSaving = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const payload = {
      usuario_id: userId,
      objetivo_id: this.seleccionado.id
    };

    this.usuarioObjetivoService.insert(payload).subscribe({
      next: () => this.crearUsuarioIngesta(userId),
      error: err => {
        this.isSaving = false;
        console.error('Error al guardar objetivo:', err);
        this.mensajeError = 'Ocurrió un error al guardar el objetivo.';
      }
    });
  }

  private crearUsuarioIngesta(userId: number) {
    const ingestaPayload = { usuarioId: userId };

    this.usuarioIngestaService.insert(ingestaPayload as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.mensajeExito = 'Objetivo guardado correctamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: err => {
        console.error('Error al crear usuario ingesta:', err);
        this.isSaving = false;
        // Igual lo dejo pasar
        this.mensajeExito = 'Objetivo guardado. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      }
    });
  }

  private extractUserIdFromToken(token: string | null): number | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload?.userId || null;
    } catch (e) {
      console.error('Error decodificando token', e);
      return null;
    }
  }
}
