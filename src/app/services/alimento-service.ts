import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alimento } from '../model/alimento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlimentoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene un alimento por su ID
   * @param id ID del alimento
   * @returns Observable con el alimento encontrado
   */
  findById(id: number): Observable<Alimento> {
    return this.http.get<Alimento>(`${this.apiUrl}/alimento/${id}`);
  }

  /**
   * Obtiene todos los alimentos
   * @returns Observable con la lista de todos los alimentos
   */
  findAll(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/alimentos`);
  }

  /**
   * Guarda un nuevo alimento
   * @param alimento Datos del alimento a crear
   * @returns Observable con el alimento creado
   */
  save(alimento: Alimento): Observable<Alimento> {
    return this.http.post<Alimento>(`${this.apiUrl}/alimento`, alimento);
  }

  /**
   * Actualiza un alimento existente
   * @param alimento Datos del alimento a actualizar
   * @returns Observable con el alimento actualizado
   */
  update(alimento: Alimento): Observable<Alimento> {
    return this.http.put<Alimento>(`${this.apiUrl}/alimento`, alimento);
  }

  /**
   * Elimina un alimento por su ID
   * @param id ID del alimento a eliminar
   * @returns Observable vacío
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alimento/${id}`);
  }

  /**
   * Busca alimentos por nombre de categoría (USER STORY 21)
   * @param nombreCategoria Nombre de la categoría a buscar
   * @returns Observable con la lista de alimentos de esa categoría
   */
  findByCategoriaNombre(nombreCategoria: string): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/alimentos/categoria/${nombreCategoria}`);
  }
}

