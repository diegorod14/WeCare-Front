import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  MatTable, MatTableDataSource, MatColumnDef,
  MatCellDef, MatHeaderCellDef, MatHeaderCell, MatCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Nutricionista } from '../../model/nutricionista';
import { NutricionistaService } from '../../services/nutricionista-service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nutricionista-component',
  imports: [
    MatTable,
    MatColumnDef,
    MatSort,
    MatSortHeader,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatPaginator,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef
  ],
  templateUrl: './nutricionista-component.html',
  styleUrls: ['./nutricionista-component.css']
})
export class NutricionistaComponent implements OnInit {
  lista: Nutricionista[] = [];
  displayedColumns: string[] = ['id', 'licensia_profesional', 'biografia', 'tarifa_consulta', 'experiencia_anos', 'duracion_consulta_minutos'];
  dataSource: MatTableDataSource<Nutricionista> = new MatTableDataSource<Nutricionista>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  nutricionistaService: NutricionistaService = inject(NutricionistaService);
  route: Router = inject(Router);
  dialog = inject(MatDialog);

  constructor() {
    console.log("Constructor NutricionistaComponent");
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    console.log('Component ngOnInit llamando al API Get');

    // 🔹 Cargar todos los nutricionistas
    this.nutricionistaService.findAll().subscribe({
      next: (data: Nutricionista[]) => this.dataSource.data = data,
      error: (err: any) => console.error('Error al obtener nutricionistas', err)
    });

    const nutri: Nutricionista = {
      id: 1,
      licensia_profesional: 'ABC123',
      biografia: 10,
      tarifa_consulta: 50,
      experiencia_anos: 5,
      duracion_consulta_minutos: 30
    };

    this.nutricionistaService.update(nutri).subscribe({
      next: (data: Nutricionista) => console.log('Actualizado:', data),
      error: (err: any) => console.error('Error al actualizar:', err)
    });
  }
}
