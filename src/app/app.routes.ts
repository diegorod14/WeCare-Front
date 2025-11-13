import { Routes } from '@angular/router';

import {HomeComponent} from "./componente/home-component/home-component";
import {AlimentoComponent} from "./componente/alimento-component/alimento-component";
import {LoginComponent} from './componente/login-component/login-component';
import {RegistrarUsuario} from './componente/registrar-usuario/registrar-usuario';
import {AlimentoNuevoComponent} from './componente/alimento-nuevo-component/alimento-nuevo-component';

export const routes: Routes = [
  {path: 'Alimento', component: AlimentoComponent},
  {path: 'registro', component: RegistrarUsuario},
  {path: 'login', component: LoginComponent},
  {path: 'NuevoAlimento', component: AlimentoNuevoComponent},
  {path: '', component: HomeComponent, pathMatch: 'full'}
];
