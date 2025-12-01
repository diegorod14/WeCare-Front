import { Component, inject, ViewChild } from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { Plato } from '../../model/plato';
import { PlatoService } from '../../services/plato-service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogo } from './confirm-dialogo/confirm-dialogo';
import { Alimentos } from './alimentos/alimentos';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlimentoService } from '../../services/alimento-service';
import { Alimento } from '../../model/alimento';

@Component({
  selector: 'app-plato-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSort,
    MatSortHeader,
    MatTable,
    MatPaginator,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatHeaderCell,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderCellDef,
    RouterLink,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    MatNoDataRow,
    MatTooltip,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './plato-component.html',
  styleUrl: './plato-component.css',
})
export class PlatoComponent {
  lista: Plato[] = [];
  platosFiltrados: Plato[] = [];
  alimentos: Alimento[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'informacion', 'consumir', 'acciones'];
  dataSource: MatTableDataSource<Plato> = new MatTableDataSource<Plato>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  platoService: PlatoService = inject(PlatoService);
  alimentoService: AlimentoService = inject(AlimentoService);
  route: Router = inject(Router);
  dialog = inject(MatDialog);
  snackBar: MatSnackBar = inject(MatSnackBar);

  filtroNombre: string = '';
  filtroAlimento: string = '';
  cargando: boolean = false;

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.cargarDatos();
    this.cargarAlimentos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.platoService.list().subscribe({
      next: (data) => {
        this.lista = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarMensaje('Error al cargar los platos', 'error');
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  cargarAlimentos(): void {
    this.alimentoService.findAll().subscribe({
      next: (data) => {
        this.alimentos = data;
      },
      error: (err) => {
        console.error('Error al cargar alimentos:', err);
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.lista];

    // Filtro por nombre del plato
    if (this.filtroNombre.trim()) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }

    this.platosFiltrados = resultado;
    this.dataSource.data = this.platosFiltrados;
    this.dataSource._updateChangeSubscription();
  }

  buscarPorAlimento(): void {
    if (!this.filtroAlimento) {
      this.cargarDatos();
      return;
    }

    // Buscar el alimento seleccionado para obtener su ID
    const alimento = this.alimentos.find(a => a.nombre === this.filtroAlimento);
    if (!alimento || !alimento.id) {
      this.mostrarMensaje('Alimento no encontrado', 'error');
      return;
    }

    this.cargando = true;

    // Llamar al endpoint que retorna los platos que contienen ese alimento
    this.platoService.obtenerPlatosPorAlimento(alimento.id).subscribe({
      next: (platosPorAlimento: any[]) => {
        // Si la respuesta es un array de objetos con propiedades de plato (PlatoConCantidadDTO)
        let platosFiltrados: Plato[] = [];

        if (platosPorAlimento && platosPorAlimento.length > 0) {
          // Mapear la respuesta al formato Plato
          platosFiltrados = platosPorAlimento.map(item => ({
            id: item.platoId ?? item.id,
            nombre: item.platoNombre ?? item.nombre,
            informacion: item.platoInformacion ?? item.informacion ?? ''
          }));
        }

        this.platosFiltrados = platosFiltrados;
        this.dataSource.data = this.platosFiltrados;
        this.dataSource._updateChangeSubscription();
        this.cargando = false;

        if (this.platosFiltrados.length === 0) {
          this.mostrarMensaje(`No hay platos que contengan "${this.filtroAlimento}"`, 'warning');
        } else {
          this.mostrarMensaje(`Se encontraron ${this.platosFiltrados.length} plato(s)`, 'success');
        }
      },
      error: (err) => {
        this.mostrarMensaje('Error al buscar platos por alimento', 'error');
        this.platosFiltrados = [];
        this.dataSource.data = this.platosFiltrados;
        this.cargando = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroAlimento = '';
    this.cargarDatos();
  }

  // 👉 Botón "Nuevo Plato" del header
  nuevoPlato() {
    this.route.navigate(['/nuevo-edit']);
  }

  // 👉 Botón de editar (icono lápiz)
  editar(element: any) {
    this.route.navigate(['/nuevo-edit', element.id]);
  }

  // 👉 Botón de consumir plato (todos los alimentos)
  consumirPlato(platoId: number) {
    this.route.navigate(['/registrar-comer-plato'], {
      queryParams: { platoId: platoId }
    });
  }

  // 👉 Botón de ver alimentos detallados
  verAlimentos(platoId: number) {
    const dialogRef = this.dialog.open(Alimentos, {
      width: '80%',
      maxWidth: '1200px',
      data: { platoId: platoId }
    });
  }

  // 👉 Botón de eliminar (icono tacho)
  openDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogo);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.platoService.delete(id).subscribe({
          next: () => this.cargaDatos(),
          error: (err) => console.log(err)
        });
      }
    });
  }

  cargaDatos(): void {
    this.cargarDatos();
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${tipo}`]
    });
  }
}
