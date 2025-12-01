import {Component, inject, OnInit} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {PlatoService} from '../../services/plato-service';
import {AlimentoService} from '../../services/alimento-service';
import {Alimento} from '../../model/alimento';
import {PlatoAlimento} from '../../model/plato-alimento';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-plato-nuevo-edit-component',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButton,
    MatCard,
    MatSelectModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './plato-nuevo-edit-component.html',
  styleUrl: './plato-nuevo-edit-component.css'
})
export class PlatoNuevoEditComponent implements OnInit {
  platoForm : FormGroup;
  fb : FormBuilder = inject(FormBuilder);
  platoService = inject(PlatoService);
  alimentoService = inject(AlimentoService);
  router = inject(Router);
  edicion : boolean = false;
  route : ActivatedRoute = inject(ActivatedRoute);
  id: number = 0;

  // Para gestionar alimentos
  alimentosDisponibles: Alimento[] = [];
  alimentoSeleccionado: number | null = null;
  cantidadAlimento: number = 100;
  dataSource = new MatTableDataSource<{alimento: Alimento, cantidad: number}>();

  displayedColumns: string[] = ['nombre', 'cantidad', 'calorias', 'acciones'];

  constructor() {
    this.platoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      informacion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarAlimentos();
    this.route.params.subscribe((data: any)  => {
      this.id = data['id'];
      console.log("ID recibido:", this.id);
      this.edicion = data['id']!=null;
      this.cargaForm();
    })
  }

  cargarAlimentos() {
    this.alimentoService.findAll().subscribe({
      next: (data: Alimento[]) => {
        this.alimentosDisponibles = data;
      },
      error: (err: any) => console.error('Error al cargar alimentos:', err)
    });
  }

  agregarAlimento() {
    if (this.alimentoSeleccionado && this.cantidadAlimento > 0) {
      const alimento = this.alimentosDisponibles.find(a => a.id === this.alimentoSeleccionado);
      if (alimento) {
        // Verificar si ya existe
        const existe = this.dataSource.data.find(a => a.alimento.id === alimento.id);
        if (existe) {
          alert('Este alimento ya fue agregado. Puedes eliminarlo y agregar de nuevo con otra cantidad.');
          return;
        }

        // Agregar a la tabla
        this.dataSource.data = [...this.dataSource.data, {alimento: alimento, cantidad: this.cantidadAlimento}];

        // Reset
        this.alimentoSeleccionado = null;
        this.cantidadAlimento = 100;
      }
    }
  }

  eliminarAlimento(index: number) {
    this.dataSource.data = this.dataSource.data.filter((_, i) => i !== index);
  }

  calcularTotalCalorias(): number {
    return this.dataSource.data.reduce((total, item) => {
      return total + (item.alimento.calorias * item.cantidad / 100);
    }, 0);
  }

  calcularTotalProteina(): number {
    return this.dataSource.data.reduce((total, item) => {
      return total + (item.alimento.proteina * item.cantidad / 100);
    }, 0);
  }

  calcularTotalCarbos(): number {
    return this.dataSource.data.reduce((total, item) => {
      return total + (item.alimento.carbohidrato * item.cantidad / 100);
    }, 0);
  }

  calcularTotalGrasas(): number {
    return this.dataSource.data.reduce((total, item) => {
      return total + (item.alimento.grasa * item.cantidad / 100);
    }, 0);
  }

  cargaForm(){
    if(this.edicion){
      this.platoService.listId(this.id).subscribe({
        next: (data: any) => {
          this.platoForm.patchValue({
            id:data.id,
            nombre:data.nombre,
            informacion:data.informacion
          })
        }
      })
    }
  }

  onSubmit(){
    if(this.platoForm.valid){
      let plato = this.platoForm.value;
      if(!this.edicion){
        // 1. Crear plato primero
        this.platoService.insert(plato).subscribe({
          next: (response: any) => {
            const platoId = response.id;

            // 2. Si hay alimentos agregados, guardar cada relación plato-alimento
            if (this.dataSource.data.length > 0 && platoId) {
              let alimentosGuardados = 0;

              this.dataSource.data.forEach(item => {
                const platoAlimento: PlatoAlimento = {
                  platoId: platoId,
                  alimentoId: item.alimento.id!,
                  cantidad: item.cantidad,
                  unidad: 'g'
                };

                this.platoService.guardarPlatoAlimento(platoAlimento).subscribe({
                  next: () => {
                    alimentosGuardados++;
                    console.log(`Alimento ${item.alimento.nombre} guardado (${alimentosGuardados}/${this.dataSource.data.length})`);

                    // Si se guardaron todos, redirigir
                    if (alimentosGuardados === this.dataSource.data.length) {
                      this.router.navigate(['/Plato']);
                    }
                  },
                  error: (err: any) => {
                    console.error(`Error al guardar alimento ${item.alimento.nombre}:`, err);
                  }
                });
              });
            } else {
              // Si no hay alimentos, redirigir inmediatamente
              this.router.navigate(['/Plato']);
            }
          },
          error: (err: any) => {
            alert('Error al crear el plato: ' + (err?.error?.message || 'Error desconocido'));
          }
        });
      } else {
        // Edición
        this.platoService.update(plato).subscribe({
          next: (response: any) => {
            const platoId = response.id || this.id;

            // Si hay nuevos alimentos, guardarlos
            if (this.dataSource.data.length > 0 && platoId) {
              let alimentosGuardados = 0;

              this.dataSource.data.forEach(item => {
                const platoAlimento: PlatoAlimento = {
                  platoId: platoId,
                  alimentoId: item.alimento.id!,
                  cantidad: item.cantidad,
                  unidad: 'g'
                };

                this.platoService.guardarPlatoAlimento(platoAlimento).subscribe({
                  next: () => {
                    alimentosGuardados++;
                    if (alimentosGuardados === this.dataSource.data.length) {
                      this.router.navigate(['/Plato']);
                    }
                  },
                  error: (err: any) => {
                    console.error('Error al guardar alimento:', err);
                  }
                });
              });
            } else {
              this.router.navigate(['/Plato']);
            }
          },
          error: (err: any) => {
            alert('Error al actualizar el plato: ' + (err?.error?.message || 'Error desconocido'));
          }
        });
      }
    }
  }
}
