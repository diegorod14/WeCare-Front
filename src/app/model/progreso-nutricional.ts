export interface ProgresoNutricional {
  usuarioId: number;
  fecha: string; // LocalDate en formato ISO

  // Valores objetivo (ingesta diaria recomendada)
  objetivoCalorias: number;
  objetivoProteina: number;
  objetivoCarbohidrato: number;
  objetivoGrasa: number;

  // Valores consumidos
  consumidoCalorias: number;
  consumidoProteina: number;
  consumidoCarbohidrato: number;
  consumidoGrasa: number;

  // Valores restantes (objetivo - consumido)
  restanteCalorias: number;
  restanteProteina: number;
  restanteCarbohidrato: number;
  restanteGrasa: number;

  // Porcentajes de cumplimiento (consumido / objetivo * 100)
  porcentajeCalorias: number;
  porcentajeProteina: number;
  porcentajeCarbohidrato: number;
  porcentajeGrasa: number;

  // Estado general
  estado: 'EN_META' | 'DEFICIT' | 'EXCESO';
  mensaje: string;
}

