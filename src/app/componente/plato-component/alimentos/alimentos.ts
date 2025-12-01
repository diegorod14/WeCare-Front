import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PlatoService } from '../../../services/plato-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alimentos',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './alimentos.html',
  styleUrl: './alimentos.css',
})
export class Alimentos implements OnInit {
  displayedColumns: string[] = ['alimentoNombre', 'cantidad', 'calorias', 'proteina', 'carbohidrato', 'grasa', 'fibra'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  platoNombre: string = '';
  platoInformacion: string = '';
  loading: boolean = true;

  // Totales
  totalProteinas: number = 0;
  totalCarbohidratos: number = 0;
  totalGrasas: number = 0;
  totalFibra: number = 0;
  totalCalorias: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  platoService: PlatoService = inject(PlatoService);
  dialogRef = inject(MatDialogRef<Alimentos>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { platoId: number }) {}

  ngOnInit(): void {
    this.cargarAlimentos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarAlimentos(): void {
    this.loading = true;
    this.platoService.obtenerPlatoConAlimentos(this.data.platoId).subscribe({
      next: (response) => {
        this.platoNombre = response.platoNombre || 'Plato';
        this.platoInformacion = response.platoInformacion || '';
        this.dataSource.data = response.alimentos || [];

        // Asignar totales
        this.totalProteinas = response.totalProteinas || 0;
        this.totalCarbohidratos = response.totalCarbohidratos || 0;
        this.totalGrasas = response.totalGrasas || 0;
        this.totalFibra = response.totalFibra || 0;
        this.totalCalorias = response.totalCalorias || 0;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar alimentos:', err);
        this.loading = false;
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  limitarDecimales(valor: number): number {
    return Math.round(valor * 100) / 100;
  }
}
