import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../model/categoria';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las categorías
   * @returns Observable con la lista de todas las categorías
   */
  findAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  /**
   * Obtiene una categoría por su ID
   * @param id ID de la categoría
   * @returns Observable con la categoría encontrada
   */
  findById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/categoria/${id}`);
  }
}
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

