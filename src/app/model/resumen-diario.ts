import { Comer } from './comer';
import { ProgresoNutricional } from './progreso-nutricional';

export interface ResumenDiario {
  usuarioId: number;
  fecha: string; // LocalDate en formato ISO

  // Lista de alimentos consumidos en el día
  alimentosConsumidos: Comer[];

  // Progreso nutricional del día
  progreso: ProgresoNutricional;

  // Totales del día
  totalCalorias: number;
  totalProteina: number;
  totalCarbohidrato: number;
  totalGrasa: number;
  totalFibra: number;

  // Cantidad de comidas registradas
  cantidadComidas: number;
}

