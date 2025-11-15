import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput, MatInputModule} from '@angular/material/input';
import {
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {MatButton} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {PlatoService} from '../../services/plato-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Plato} from '../../model/plato';

@Component({
  selector: 'app-plato-nuevo-edit-component',
  imports: [
    ReactiveFormsModule,
    MatInputModule,//add
    MatDatepickerModule, // add
    MatNativeDateModule,
    MatButton,
    MatCardContent,
    MatCardTitle,
    MatCard,
    // add
  ],
  templateUrl: './plato-nuevo-edit-component.html',
  styleUrl: './plato-nuevo-edit-component.css'
})
export class PlatoNuevoEditComponent {
  platoForm : FormGroup;
  fb : FormBuilder = inject(FormBuilder)
  platoService = inject(PlatoService);
  router = inject(Router);
  edicion : boolean = false;
  route : ActivatedRoute = inject(ActivatedRoute);
  id: number = 0;
  constructor() {
    this.platoForm = this.fb.group({
      id: [''],
      nombre : ['', Validators.required],
      informacion: ['', Validators.required],
      user: ['', Validators.required],
      esFavorito: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.route.params.subscribe(data  => {
      this.id = data['id'];
      console.log("ID recibido:", this.id);
      this.edicion = data['id']!=null;
      this.cargaForm();
    })
  }
  cargaForm(){
    if(this.edicion){
      //llamanos al api para obtener los datos del proveedor x id
      this.platoService.listId(this.id).subscribe({
        next: data => {
          this.platoForm.patchValue({
            id:data.id,
            nombre:data.nombre,
            informacion:data.informacion,
            user: data.user,
            esFavorito: data.esFavorito,
          })
        }
      })
      //cargamos esos datos en el form
    }
  }
  onSubmit(){
    if(this.platoForm.valid){
      let plato = new Plato();
      //proveedor.nombre = this.proveedorForm.controls['nombre'].value;
      //proveedor.direccion = this.proveedorForm.controls['direccion'].value;
      //etc..
      plato = this.platoForm.value; //resumen
      if(!this.edicion){
        console.log("Datos leidos del form:",plato);
        this.platoService.insert(plato).subscribe({
          next: data => {
            console.log("Data insertada:",data);
            this.router.navigate(['/platos']); //ojo
          }
        });

      } else{
        this.platoService.update(plato).subscribe({
          next: data => {
            console.log("Data actualizada:",data);
            this.router.navigate(['/platos']); //ojo
          }
        });
      }
    }
  }
}
