import { Component, OnInit, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Nutricionista } from '../../model/nutricionista';
import { NutricionistaService } from '../../services/nutricionista-service';

@Component({
  selector: 'app-nutricionista-component',
  standalone: true,
  imports: [
    NgFor,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './nutricionista-component.html',
  styleUrls: ['./nutricionista-component.css']
})
export class NutricionistaComponent implements OnInit {

  nutricionistas: Nutricionista[] = [];
  filteredNutricionistas: Nutricionista[] = [];

  nutricionistaService: NutricionistaService = inject(NutricionistaService);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.nutricionistaService.findAll().subscribe({
      next: (data: Nutricionista[]) => {
        this.nutricionistas = data;
        this.filteredNutricionistas = data;
      },
      error: err => console.error('Error al obtener nutricionistas', err)
    });
  }

  onBuscar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();

    this.filteredNutricionistas = this.nutricionistas.filter(n => {
      const texto = (
        n.nombre + ' ' +
        n.apellido + ' ' +
        n.biografia + ' ' +
        n.licensia_profesional
      ).toLowerCase();
      return texto.includes(valor);
    });
  }

  verDetalle(nutricionistaId: number): void {
    this.router.navigate(['/nutricionista', nutricionistaId]);
  }
}
