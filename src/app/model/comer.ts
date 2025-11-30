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

