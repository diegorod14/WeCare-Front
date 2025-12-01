import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Alimento } from '../../model/alimento';
import { Categoria } from '../../model/categoria';
import { AlimentoService } from '../../services/alimento-service';
import { CategoriaService } from '../../services/categoria-service';

@Component({
  selector: 'app-alimento-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './alimento-component.html',
  styleUrls: ['./alimento-component.css']
})
export class AlimentoComponent implements OnInit {
  alimentos: Alimento[] = [];
  alimentosFiltrados: Alimento[] = [];
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['nombre', 'proteina', 'carbohidrato', 'grasa', 'fibra', 'calorias', 'categoria', 'consumir', 'acciones'];
  alimentoSeleccionado: Alimento = this.crearAlimentoVacio();
  modoEdicion: boolean = false;
  mostrarFormulario: boolean = false;
  filtroNombre: string = '';
  filtroCategoria: string = '';
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  cargando: boolean = false;
  usuarioId: number = 1;

  constructor(
    private alimentoService: AlimentoService,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarAlimentos();
    this.cargarCategorias();
  }

  cargarAlimentos(): void {
    this.cargando = true;
    this.alimentoService.findAll().subscribe({
      next: (data) => {
        this.alimentos = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar los alimentos', 'error');
        console.error('Error:', error);
        this.cargando = false;
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.findAll().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar las categorías', 'error');
        console.error('Error:', error);
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.alimentos];
    if (this.filtroNombre.trim()) {
      resultado = resultado.filter(a =>
        a.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    if (this.filtroCategoria) {
      resultado = resultado.filter(a =>
        a.categoriaNombre === this.filtroCategoria
      );
    }
    this.alimentosFiltrados = resultado;
  }

  buscarPorCategoria(): void {
    if (!this.filtroCategoria) {
      this.cargarAlimentos();
      return;
    }
    this.cargando = true;
    this.alimentoService.findByCategoriaNombre(this.filtroCategoria).subscribe({
      next: (data) => {
        this.alimentos = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al buscar alimentos por categoría', 'error');
        console.error('Error:', error);
        this.cargando = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroCategoria = '';
    this.cargarAlimentos();
  }

  nuevoAlimento(): void {
    this.router.navigate(['/NuevoAlimento']);
  }

  editarAlimento(alimento: Alimento): void {
    this.alimentoSeleccionado = { ...alimento };
    this.modoEdicion = true;
    this.mostrarFormulario = true;
  }

  guardarAlimento(): void {
    if (!this.validarAlimento()) {
      return;
    }
    this.cargando = true;
    if (this.modoEdicion) {
      this.alimentoService.update(this.alimentoSeleccionado).subscribe({
        next: () => {
          this.mostrarMensaje('Alimento actualizado exitosamente', 'success');
          this.cargarAlimentos();
          this.cancelar();
          this.cargando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al actualizar el alimento', 'error');
          console.error('Error:', error);
          this.cargando = false;
        }
      });
    } else {
      this.alimentoService.save(this.alimentoSeleccionado).subscribe({
        next: () => {
          this.mostrarMensaje('Alimento creado exitosamente', 'success');
          this.cargarAlimentos();
          this.cancelar();
          this.cargando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al crear el alimento', 'error');
          console.error('Error:', error);
          this.cargando = false;
        }
      });
    }
  }

  eliminarAlimento(alimento: Alimento): void {
    if (!confirm(`¿Está seguro de eliminar el alimento "${alimento.nombre}"?`)) {
      return;
    }
    this.cargando = true;
    this.alimentoService.delete(alimento.id!).subscribe({
      next: () => {
        this.mostrarMensaje('Alimento eliminado exitosamente', 'success');
        this.cargarAlimentos();
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al eliminar el alimento', 'error');
        console.error('Error:', error);
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.alimentoSeleccionado = this.crearAlimentoVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = false;
  }

  validarAlimento(): boolean {
    if (!this.alimentoSeleccionado.nombre || this.alimentoSeleccionado.nombre.trim() === '') {
      this.mostrarMensaje('El nombre del alimento es obligatorio', 'warning');
      return false;
    }
    if (!this.alimentoSeleccionado.categoriaId) {
      this.mostrarMensaje('Debe seleccionar una categoría', 'warning');
      return false;
    }
    if (this.alimentoSeleccionado.proteina < 0 || this.alimentoSeleccionado.carbohidrato < 0 ||
        this.alimentoSeleccionado.grasa < 0 || this.alimentoSeleccionado.fibra < 0 ||
        this.alimentoSeleccionado.calorias < 0) {
      this.mostrarMensaje('Los valores nutricionales no pueden ser negativos', 'warning');
      return false;
    }
    return true;
  }

  crearAlimentoVacio(): Alimento {
    return {
      nombre: '',
      proteina: 0,
      carbohidrato: 0,
      grasa: 0,
      fibra: 0,
      calorias: 0,
      categoriaId: undefined
    };
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get alimentosPaginados(): Alimento[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.alimentosFiltrados.slice(startIndex, startIndex + this.pageSize);
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${tipo}`]
    });
  }

  abrirDialogoConsumo(alimento: Alimento): void {
    this.router.navigate(['/registrar-comer'], {
      queryParams: { alimentoId: alimento.id }
    });
  }
}

