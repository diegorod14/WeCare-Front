import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComerRequest } from '../../model/comer';
import { ComerService } from '../../services/comer-service';
import { PlatoService } from '../../services/plato-service';

interface AlimentoEnPlato {
  alimentoId: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  calorias?: number;
  proteina?: number;
  carbohidrato?: number;
  grasa?: number;
  selected: boolean;
}

@Component({
  selector: 'app-registrar-comer-plato-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './registrar-comer-plato-component.html',
  styleUrl: './registrar-comer-plato-component.css'
})
export class RegistrarComerPlatoComponent implements OnInit {
  platoId: number = 0;
  platoNombre: string = '';
  alimentosEnPlato: AlimentoEnPlato[] = [];
  displayedColumns: string[] = ['select', 'nombre', 'cantidad', 'unidad', 'informacion'];

  fechaConsumo: string = '';
  horaConsumo: string = '';
  nota: string = '';

  cargando: boolean = false;
  usuarioId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comerService: ComerService,
    private platoService: PlatoService,
    private snackBar: MatSnackBar
  ) {
    this.fechaConsumo = this.getLocalDate();
    this.horaConsumo = this.getLocalTime();
  }

  ngOnInit(): void {
    // Obtener el ID del usuario del token
    const token = localStorage.getItem('token');
    const userId = this.extractUserIdFromToken(token);

    if (!userId) {
      this.mostrarMensaje('⚠️ Sesión inválida. Por favor, inicie sesión nuevamente.', 'warning');
      this.router.navigate(['/login']);
      return;
    }
    this.usuarioId = userId;

    // Obtener el ID del plato desde la ruta
    const platoId = this.route.snapshot.queryParams['platoId'];

    if (platoId) {
      this.cargarAlimentosDelPlato(+platoId);
    } else {
      this.mostrarMensaje('⚠️ No se especificó el plato', 'warning');
      this.router.navigate(['/plato']);
    }
  }

  /**
   * Carga los alimentos asociados al plato
   */
  cargarAlimentosDelPlato(platoId: number): void {
    this.cargando = true;
    this.platoId = platoId;

    this.platoService.obtenerPlatoConAlimentos(platoId).subscribe({
      next: (platoConAlimentos) => {
        console.log('📊 Plato cargado:', platoConAlimentos);

        // Obtener el nombre correcto del plato
        this.platoNombre = platoConAlimentos.platoNombre || platoConAlimentos.nombre || 'Plato';
        console.log('🍽️ Nombre del plato asignado:', this.platoNombre);

        // Mapear los alimentos del plato
        if (platoConAlimentos.alimentos && platoConAlimentos.alimentos.length > 0) {
          this.alimentosEnPlato = platoConAlimentos.alimentos.map((item: any) => {
            return {
              alimentoId: item.alimentoId,
              nombre: item.alimentoNombre || item.nombre,
              cantidad: item.cantidad,
              unidad: item.unidad,
              calorias: item.calorias || 0,
              proteina: item.proteina || 0,
              carbohidrato: item.carbohidrato || 0,
              grasa: item.grasa || 0,
              selected: true
            };
          });
        }

        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('❌ Error al cargar los alimentos del plato', 'error');
        this.cargando = false;
        this.router.navigate(['/plato']);
      }
    });
  }

  /**
   * Registra el consumo de todos los alimentos seleccionados del plato
   */
  registrarConsumoPlato(): void {
    // Filtrar solo los alimentos seleccionados
    const alimentosSeleccionados = this.alimentosEnPlato.filter(a => a.selected);

    if (alimentosSeleccionados.length === 0) {
      this.mostrarMensaje('⚠️ Debe seleccionar al menos un alimento', 'warning');
      return;
    }

    this.cargando = true;

    // Contador para rastrear peticiones completadas
    let completadas = 0;
    const total = alimentosSeleccionados.length;
    let erroresCount = 0;

    // Registrar cada alimento seleccionado
    alimentosSeleccionados.forEach((alimento) => {
      const request: ComerRequest = {
        alimentoId: alimento.alimentoId,
        cantidad: alimento.cantidad,
        unidad: alimento.unidad,
        fechaConsumo: this.fechaConsumo,
        horaConsumo: this.horaConsumo,
        nota: `Del plato: ${this.platoNombre}. ${this.nota}`
      };

      this.comerService.registrarConsumo(this.usuarioId, request).subscribe({
        next: (response) => {
          completadas++;

          if (completadas === total) {
            this.cargando = false;
            this.mostrarMensaje(
              `✅ Plato "${this.platoNombre}" consumido con éxito. ${completadas} alimento(s) registrado(s).`,
              'success'
            );

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/dashboard']);
              });
            }, 2000);
          }
        },
        error: (error) => {
          erroresCount++;
          completadas++;

          if (completadas === total) {
            this.cargando = false;
            if (erroresCount > 0) {
              this.mostrarMensaje(
                `⚠️ Se registraron ${completadas - erroresCount} de ${total} alimentos. Hubo ${erroresCount} error(es).`,
                'warning'
              );
            } else {
              this.mostrarMensaje('✅ Todos los alimentos del plato fueron consumidos.', 'success');
              setTimeout(() => {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/dashboard']);
                });
              }, 2000);
            }
          }
        }
      });
    });
  }

  /**
   * Cancela la operación y vuelve atrás
   */
  cancelar(): void {
    this.router.navigate(['/plato']);
  }

  /**
   * Selecciona todos los alimentos
   */
  seleccionarTodos(): void {
    this.alimentosEnPlato.forEach(a => a.selected = true);
  }

  /**
   * Deselecciona todos los alimentos
   */
  deseleccionarTodos(): void {
    this.alimentosEnPlato.forEach(a => a.selected = false);
  }

  /**
   * Obtiene el total de calorías de los alimentos seleccionados
   */
  get totalCaloriasSeleccionadas(): number {
    return this.alimentosEnPlato
      .filter(a => a.selected)
      .reduce((sum, a) => sum + (a.calorias || 0), 0);
  }

  /**
   * Obtiene la cantidad de alimentos seleccionados
   */
  get alimentosSeleccionadosCount(): number {
    return this.alimentosEnPlato.filter(a => a.selected).length;
  }

  /**
   * Verifica si el botón debe estar deshabilitado
   */
  get botonRegistrarDeshabilitado(): boolean {
    return this.cargando || this.alimentosSeleccionadosCount === 0;
  }


  /**
   * Extrae el userId desde el token JWT
   */
  private extractUserIdFromToken(token: string | null): number | null {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]))?.userId || null;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene la fecha local en formato YYYY-MM-DD
   */
  private getLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene la hora local en formato HH:mm
   */
  private getLocalTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Muestra un mensaje con snackbar
   */
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${tipo}`]
    });
  }
}

