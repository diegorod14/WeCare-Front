import { Routes } from '@angular/router';

import { HomeComponent } from "./componente/home-component/home-component";
import { AlimentoComponent } from "./componente/alimento-component/alimento-component";
import { LoginComponent } from './componente/login-component/login-component';
import { RegistrarUsuario } from './componente/registrar-usuario/registrar-usuario';
import { AlimentoNuevoComponent } from './componente/alimento-nuevo-component/alimento-nuevo-component';
import { PlatoComponent } from './componente/plato-component/plato-component';
import { PlatoNuevoEditComponent } from './componente/plato-nuevo-edit-component/plato-nuevo-edit-component';
import { InfoComponent } from './componente/info-component/info-component';
import { ElegirObjetivosComponent } from './componente/elegir-objetivos-component/elegir-objetivos-component';
import { DashboardComponent } from './componente/dashboard-component/dashboard-component';
import { NutricionistaComponent } from './componente/nutricionista-component/nutricionista-component';
import { NutricionistaInfoComponent } from './componente/nutricionista-info-component/nutricionista-info-component';
import { UsuarioComponent } from './componente/usuario-component/usuario-component';
import { UsuarioInfoComponent } from './componente/usuario-info-component/usuario-info-component';
import { ConfiguracionComponent } from './componente/configuracion-component/configuracion-component';
import { CitasProgramadasComponent } from './componente/citas-programadas-component/citas-programadas-component';
import { RegistrarComerComponent } from './componente/registrar-comer-component/registrar-comer-component';

export const routes: Routes = [
  // Home y autenticación
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistrarUsuario },

  // Dashboard y configuración
  { path: 'dashboard', component: DashboardComponent },
  { path: 'config', component: ConfiguracionComponent },
  { path: 'info', component: InfoComponent },
  { path: 'actividad/:userId', component: InfoComponent },
  { path: 'objetivos', component: ElegirObjetivosComponent },

  // Alimentos
  { path: 'Alimento', component: AlimentoComponent },
  { path: 'NuevoAlimento', component: AlimentoNuevoComponent },
  { path: 'registrar-comer', component: RegistrarComerComponent }, // ✅ NUEVA RUTA

  // Platos
  { path: 'Plato', component: PlatoComponent },
  { path: 'nuevo-edit', component: PlatoNuevoEditComponent },
  { path: 'nuevo-edit/:id', component: PlatoNuevoEditComponent },

  // Nutricionistas y citas
  { path: 'ListaNutricionista', component: NutricionistaComponent },
  { path: 'nutricionista/:id', component: NutricionistaInfoComponent },
  { path: 'citas-programadas', component: CitasProgramadasComponent },

  // Usuarios
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'usuarioinfo/:id', component: UsuarioInfoComponent }
];

