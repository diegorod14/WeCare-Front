import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {TextFieldModule} from '@angular/cdk/text-field';

export interface CitaDialogData {
  tipo_consulta: string;
  estado: string;
  motivo_consulta: string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TextFieldModule
  ],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
})
export class DialogComponent {
  tiposConsulta = [
    { value: 'EVALUACION_INICIAL', label: 'Evaluación inicial' },
    { value: 'SEGUIMIENTO', label: 'Seguimiento' },
    { value: 'ESPECIALIZADA', label: 'Especializada' },
  ];

  readonly estadoFijo = 'PROGRAMADA';
  readonly usuarioId: number | null;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CitaDialogData
  ) {
    this.data.estado = this.estadoFijo;
    this.data.tipo_consulta =
      this.data.tipo_consulta || this.tiposConsulta[0].value;
    this.usuarioId = this.obtenerUserIdDesdeToken();
  }

  guardar() {
    if (!this.usuarioId) {
      alert('No se pudo obtener el usuario. Inicia sesión nuevamente.');
      this.dialogRef.close(null);
      return;
    }
    this.dialogRef.close({
      ...this.data,
      usuarioId: this.usuarioId,
      estado: this.estadoFijo,
    });
  }

  cancelar() {
    this.dialogRef.close(null);
  }

  private obtenerUserIdDesdeToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    try {
      const payload = this.extractUserIdFromToken(token);
      return payload ?? null;
    } catch (error) {
      console.error('Error decodificando token', error);
      return null;
    }
  }

  private extractUserIdFromToken(token: string): number | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(parts[1]));
      return payload?.userId ?? null;
    } catch (error) {
      console.error('Error al parsear el token', error);
      return null;
    }
  }
}
