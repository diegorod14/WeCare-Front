export interface Alimento {
  id?: number;
  nombre: string;
  proteina: number;
  carbohidrato: number;
  grasa: number;
  fibra: number;
  calorias: number;
  categoriaId?: number;
  categoriaNombre?: string;
  categoriaInformacion?: string;
}

