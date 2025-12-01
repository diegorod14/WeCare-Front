import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UsuarioInformacion } from '../../model/usuario-informacion';
import { UsuarioIngesta } from '../../model/usuario-ingesta';
import { Objetivo } from '../../model/objetivo';
import { UsuarioService } from '../../services/user-service';
import { UsuarioInformacionService } from '../../services/usuario-informacion-service';
import { UsuarioIngestaService } from '../../services/usuario-ingesta-service';
import { UsuarioObjetivoServices } from '../../services/usuario-objetivo-services';
import { ObjetivoServices } from '../../services/objetivo-services';
import { ComerService } from '../../services/comer-service';
import { ResumenDiario } from '../../model/resumen-diario';
import { ProgresoNutricional } from '../../model/progreso-nutricional';

interface MacroItem {
  label: string;
  value: number;
  percent: number; // Agregamos el porcentaje numérico
  color: string;
}

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuarioInformacion: UsuarioInformacion = new UsuarioInformacion();
  usuarioIngesta: UsuarioIngesta = new UsuarioIngesta();
  objetivo: Objetivo = new Objetivo();

  nombreUsuario = 'Usuario';
  pesoActual = 0;
  pesoIdeal = 0;
  imc = 0;
  pesoMensaje = '';

  totalCalorias = 0;
  macros: MacroItem[] = [];
  macroPieGradient = '';

  // Progreso nutricional del día
  resumenDiario?: ResumenDiario;
  progresoNutricional?: ProgresoNutricional;
  cargandoProgreso: boolean = false;
  errorProgreso: string = '';

  // Macros consumidos del día
  macrosConsumidos: MacroItem[] = [];
  macrosConsumidosGradient = '';

  // Subscription para limpiar
  private routerSubscription?: Subscription;

  // Exponer Math para el template
  Math = Math;

  // Colores (Extraídos de tu imagen referencia)
  readonly COLORS = {
    pro: '#66bb6a', // Verde
    carb: '#ffca28', // Amarillo
    fat: '#ef5350'   // Rojo
  };

  private usuarioService = inject(UsuarioService);
  private usuarioInfoService = inject(UsuarioInformacionService);
  private usuarioIngestaService = inject(UsuarioIngestaService);
  private usuarioObjService = inject(UsuarioObjetivoServices);
  private objetivoService = inject(ObjetivoServices);
  private comerService = inject(ComerService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarDatosCompletos();

    // Suscribirse a eventos de navegación para recargar datos
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Recargar solo si navegamos al dashboard
      if (event.url === '/dashboard' || event.urlAfterRedirects === '/dashboard') {
        this.cargarDatosCompletos();
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar suscripción
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  cargarDatosCompletos(): void {
    const token = localStorage.getItem('token');
    const userId = this.extractUserIdFromToken(token);

    if (userId) {
      this.cargarDatos(userId);
    } else {
      const userIdFromStorage = Number(localStorage.getItem('userId'));
      if (userIdFromStorage) {
        this.cargarDatos(userIdFromStorage);
      }
    }
  }

  private cargarDatos(userId: number): void {
    this.usuarioService.listId(userId).subscribe({
      next: (u: any) => {
        this.nombreUsuario = u.nombres || 'Usuario';
      },
      error: (err: any) => console.error('Error cargando usuario', err)
    });

    this.usuarioInfoService.listId(userId).subscribe({
      next: (info: any) => {
        this.usuarioInformacion = info;
        this.pesoActual = info.pesoKg;
        this.calcularDerivados();
      },
      error: (err: any) => console.error('Error cargando información usuario', err)
    });

    this.usuarioIngestaService.update(userId).subscribe({
      next: (ingesta: any) => {
        this.usuarioIngesta = ingesta;
        this.pesoIdeal = ingesta.pesoIdeal;
        this.imc = ingesta.imc;
        this.calcularDerivados();
      },
      error: (err: any) => console.error('Error actualizando ingesta usuario', err)
    });

    this.usuarioObjService.findByUsuarioId(userId).subscribe({
      next: (objs: any) => {
        if (objs && objs.length > 0) {
          const ultimoObjetivoId = objs[objs.length - 1].objetivo_id;
          this.objetivoService.findById(ultimoObjetivoId).subscribe({
            next: (obj: any) => {
              this.objetivo = obj;
            },
            error: (err: any) => console.error('Error cargando objetivo', err)
          });
        }
      },
      error: (err: any) => console.error('Error cargando objetivos usuario', err)
    });

    // Cargar progreso nutricional del día
    this.cargarProgresoDelDia(userId);
  }

  private calcularDerivados(): void {
    // 1. Peso y Mensajes
    const diff = Math.abs(this.pesoActual - this.pesoIdeal);
    if (diff <= 1) this.pesoMensaje = 'Mantén el enfoque, ¡estás excelente!';
    else if (diff <= 3) this.pesoMensaje = '¡Estás muy cerca, un último esfuerzo!';
    else this.pesoMensaje = 'Tienes camino por recorrer, ¡tú puedes!';

    // 2. Datos Macros
    this.totalCalorias = this.usuarioIngesta.ingestaDiariaCalorias || 0;

    const pro = this.usuarioIngesta.ingestaDiariaProteina || 0;
    const carb = this.usuarioIngesta.ingestaDiariaCarbohidrato || 0;
    const fat = this.usuarioIngesta.ingestaDiariaGrasa || 0;

    // Calcular porcentajes reales basados en gramos totales (para la leyenda y gráfico)
    const totalGrams = (pro + carb + fat) || 1;

    const pPro = (pro / totalGrams) * 100;
    const pCarb = (carb / totalGrams) * 100;
    const pFat = (fat / totalGrams) * 100;

    this.macros = [
      { label: 'Proteína', value: pro, percent: pPro, color: this.COLORS.pro },
      { label: 'Carbohidratos', value: carb, percent: pCarb, color: this.COLORS.carb },
      { label: 'Grasas', value: fat, percent: pFat, color: this.COLORS.fat }
    ];

    // 3. Gradiente Gráfico (Lógica acumulativa para conic-gradient)
    // El gráfico empieza en 0. Proteína va de 0 a X. Carbo de X a Y. Grasa de Y a 100.
    this.macroPieGradient = `conic-gradient(
      ${this.COLORS.pro} 0% ${pPro}%,
      ${this.COLORS.carb} ${pPro}% ${pPro + pCarb}%,
      ${this.COLORS.fat} ${pPro + pCarb}% 100%
    )`;
  }

  private extractUserIdFromToken(token: string | null): number | null {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]))?.userId || null;
    } catch { return null; }
  }

  /**
   * Carga el resumen y progreso nutricional del día actual
   */
  private cargarProgresoDelDia(userId: number): void {
    this.cargandoProgreso = true;
    this.errorProgreso = '';

    // Obtener fecha local para evitar problemas de timezone
    const fechaHoy = this.getLocalDate();

    // Usar endpoint con fecha específica en lugar de "hoy" para evitar problemas de timezone
    this.comerService.obtenerResumenDelDia(userId, fechaHoy).subscribe({
      next: (resumen: ResumenDiario) => {
        this.resumenDiario = resumen;
        this.progresoNutricional = resumen.progreso;
        this.calcularMacrosConsumidos();
        this.cargandoProgreso = false;
      },
      error: (err: any) => {
        console.error('Error cargando progreso del día:', err);
        this.errorProgreso = 'No se pudo cargar el progreso del día. Asegúrate de tener configurada tu ingesta diaria.';
        this.cargandoProgreso = false;
      }
    });
  }

  /**
   * Calcula los macros consumidos del día para visualización
   */
  private calcularMacrosConsumidos(): void {
    if (!this.progresoNutricional) {
      return;
    }

    const pro = this.progresoNutricional.consumidoProteina || 0;
    const carb = this.progresoNutricional.consumidoCarbohidrato || 0;
    const fat = this.progresoNutricional.consumidoGrasa || 0;

    const totalGrams = (pro + carb + fat) || 1;

    const pPro = (pro / totalGrams) * 100;
    const pCarb = (carb / totalGrams) * 100;
    const pFat = (fat / totalGrams) * 100;

    this.macrosConsumidos = [
      { label: 'Proteína', value: pro, percent: pPro, color: this.COLORS.pro },
      { label: 'Carbohidratos', value: carb, percent: pCarb, color: this.COLORS.carb },
      { label: 'Grasas', value: fat, percent: pFat, color: this.COLORS.fat }
    ];

    this.macrosConsumidosGradient = `conic-gradient(
      ${this.COLORS.pro} 0% ${pPro}%,
      ${this.COLORS.carb} ${pPro}% ${pPro + pCarb}%,
      ${this.COLORS.fat} ${pPro + pCarb}% 100%
    )`;
  }

  /**
   * Obtiene el color de estado según el progreso
   */
  getEstadoColor(): string {
    if (!this.progresoNutricional) return '#999';

    switch (this.progresoNutricional.estado) {
      case 'EN_META':
        return '#4caf50'; // Verde
      case 'DEFICIT':
        return '#ff9800'; // Naranja
      case 'EXCESO':
        return '#f44336'; // Rojo
      default:
        return '#999';
    }
  }

  /**
   * Obtiene el ícono según el estado
   */
  getEstadoIcono(): string {
    if (!this.progresoNutricional) return 'help';

    switch (this.progresoNutricional.estado) {
      case 'EN_META':
        return 'check_circle';
      case 'DEFICIT':
        return 'trending_down';
      case 'EXCESO':
        return 'trending_up';
      default:
        return 'help';
    }
  }

  /**
   * Obtiene los alimentos consumidos que NO vienen de un plato
   */
  get alimentosIndividuales() {
    if (!this.resumenDiario?.alimentosConsumidos) return [];
    return this.resumenDiario.alimentosConsumidos.filter(consumo =>
      !consumo.nota || !consumo.nota.startsWith('Del plato:')
    );
  }

  /**
   * Agrupa los alimentos que vienen de platos
   */
  get platosConAlimentos() {
    if (!this.resumenDiario?.alimentosConsumidos) return [];

    const platoMap = new Map<string, any[]>();

    this.resumenDiario.alimentosConsumidos.forEach(consumo => {
      if (consumo.nota && consumo.nota.startsWith('Del plato:')) {
        // Extraer nombre del plato de la nota
        const match = consumo.nota.match(/Del plato: ([^.]+)/);
        const platoNombre = match ? match[1] : 'Plato desconocido';

        if (!platoMap.has(platoNombre)) {
          platoMap.set(platoNombre, []);
        }
        platoMap.get(platoNombre)!.push(consumo);
      }
    });

    // Convertir Map a array de objetos
    return Array.from(platoMap.entries()).map(([nombre, alimentos]) => ({
      nombre,
      alimentos,
      totalCalorias: alimentos.reduce((sum, a) => sum + (a.caloriasCalculadas || 0), 0),
      horaConsumo: alimentos[0]?.horaConsumo
    }));
  }

  /**
   * Obtiene la fecha local en formato YYYY-MM-DD sin problemas de timezone
   */
  private getLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
