import { Routes } from '@angular/router';

import {HomeComponent} from "./componente/home-component/home-component";
import {AlimentoComponent} from "./componente/alimento-component/alimento-component";
import {LoginComponent} from './componente/login-component/login-component';
import {RegistrarUsuario} from './componente/registrar-usuario/registrar-usuario';
import {AlimentoNuevoComponent} from './componente/alimento-nuevo-component/alimento-nuevo-component';
import {PlatoComponent} from './componente/plato-component/plato-component';
import {PlatoNuevoEditComponent} from './componente/plato-nuevo-edit-component/plato-nuevo-edit-component';

export const routes: Routes = [
  {path: 'Alimento', component: AlimentoComponent},
  {path: 'nuevo-edit', component: PlatoNuevoEditComponent},
  {path: 'nuevo-edit/:id', component: PlatoNuevoEditComponent},
  {path: 'Plato', component: PlatoComponent},
  {path: 'registro', component: RegistrarUsuario},
  {path: 'login', component: LoginComponent},
  {path: 'NuevoAlimento', component: AlimentoNuevoComponent},
  {path: '', component: HomeComponent, pathMatch: 'full'}
];
