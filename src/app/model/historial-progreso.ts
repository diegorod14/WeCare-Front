import { ProgresoNutricional } from './progreso-nutricional';

export interface HistorialProgreso {
  usuarioId: number;
  fechaInicio: string; // LocalDate en formato ISO
  fechaFin: string; // LocalDate en formato ISO

  // Lista de progresos por fecha
  progresosPorFecha: ProgresoNutricional[];

  // Promedios del período
  promedioCalorias: number;
  promedioProteina: number;
  promedioCarbohidrato: number;
  promedioGrasa: number;

  // Cumplimiento general del período
  porcentajeCumplimientoGeneral: number;
  diasRegistrados: number;
  diasEnMeta: number;
  diasDeficit: number;
  diasExceso: number;
}
export interface Comer {
  id?: number;
  usuarioId: number;
  alimentoId: number;
  alimentoNombre?: string;
  fechaConsumo: string; // LocalDate en formato ISO
  cantidad: number;
  unidad: string;
  horaConsumo?: string; // LocalTime en formato HH:mm:ss
  nota?: string;
  fechaRegistro?: string; // LocalDateTime en formato ISO

  // Valores nutricionales calculados según la cantidad consumida
  caloriasCalculadas?: number;
  proteinasCalculadas?: number;
  carbohidratosCalculados?: number;
  grasasCalculadas?: number;
  fibraCalculada?: number;
}

export interface ComerRequest {
  alimentoId: number;
  cantidad: number;
  unidad: string;
  fechaConsumo?: string;
  horaConsumo?: string;
  nota?: string;
}

