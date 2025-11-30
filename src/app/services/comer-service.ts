import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comer, ComerRequest } from '../model/comer';
import { ProgresoNutricional } from '../model/progreso-nutricional';
import { ResumenDiario } from '../model/resumen-diario';
import { HistorialProgreso } from '../model/historial-progreso';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComerService {
  private apiUrl = `${environment.apiUrl}/comer`;

  constructor(private http: HttpClient) { }

  /**
   * Registra el consumo de un alimento con cálculos nutricionales automáticos
   * @param usuarioId ID del usuario
   * @param request Datos del consumo
   */
  registrarConsumo(usuarioId: number, request: ComerRequest): Observable<Comer> {
    return this.http.post<Comer>(`${this.apiUrl}/usuario/${usuarioId}/registrar`, request);
  }

  /**
   * Obtiene los consumos de un usuario en una fecha específica
   * @param usuarioId ID del usuario
   * @param fecha Fecha en formato ISO (YYYY-MM-DD)
   */
  obtenerConsumosPorFecha(usuarioId: number, fecha: string): Observable<Comer[]> {
    return this.http.get<Comer[]>(`${this.apiUrl}/usuario/${usuarioId}/fecha/${fecha}`);
  }

  /**
   * Obtiene el historial completo de consumos de un usuario
   * @param usuarioId ID del usuario
   */
  obtenerHistorial(usuarioId: number): Observable<Comer[]> {
    return this.http.get<Comer[]>(`${this.apiUrl}/usuario/${usuarioId}/historial`);
  }

  /**
   * Obtiene el progreso nutricional de un día específico
   * @param usuarioId ID del usuario
   * @param fecha Fecha en formato ISO (YYYY-MM-DD)
   */
  obtenerProgresoDelDia(usuarioId: number, fecha: string): Observable<ProgresoNutricional> {
    return this.http.get<ProgresoNutricional>(`${this.apiUrl}/usuario/${usuarioId}/progreso/${fecha}`);
  }

  /**
   * Obtiene el progreso nutricional de hoy
   * @param usuarioId ID del usuario
   */
  obtenerProgresoDeHoy(usuarioId: number): Observable<ProgresoNutricional> {
    return this.http.get<ProgresoNutricional>(`${this.apiUrl}/usuario/${usuarioId}/progreso/hoy`);
  }

  /**
   * Obtiene el resumen completo del día con alimentos y progreso
   * @param usuarioId ID del usuario
   * @param fecha Fecha en formato ISO (YYYY-MM-DD)
   */
  obtenerResumenDelDia(usuarioId: number, fecha: string): Observable<ResumenDiario> {
    return this.http.get<ResumenDiario>(`${this.apiUrl}/usuario/${usuarioId}/resumen/${fecha}`);
  }

  /**
   * Obtiene el resumen completo de hoy
   * @param usuarioId ID del usuario
   */
  obtenerResumenDeHoy(usuarioId: number): Observable<ResumenDiario> {
    return this.http.get<ResumenDiario>(`${this.apiUrl}/usuario/${usuarioId}/resumen/hoy`);
  }

  /**
   * Obtiene el historial de progreso en un rango de fechas
   * @param usuarioId ID del usuario
   * @param fechaInicio Fecha de inicio en formato ISO
   * @param fechaFin Fecha de fin en formato ISO
   */
  obtenerHistorialProgreso(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<HistorialProgreso> {
    return this.http.get<HistorialProgreso>(
      `${this.apiUrl}/usuario/${usuarioId}/historial-progreso?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  /**
   * Obtiene el historial de progreso de los últimos 7 días
   * @param usuarioId ID del usuario
   */
  obtenerHistorialUltimaSemana(usuarioId: number): Observable<HistorialProgreso> {
    return this.http.get<HistorialProgreso>(`${this.apiUrl}/usuario/${usuarioId}/historial-progreso/ultima-semana`);
  }

  /**
   * Obtiene el historial de progreso del mes actual
   * @param usuarioId ID del usuario
   */
  obtenerHistorialMesActual(usuarioId: number): Observable<HistorialProgreso> {
    return this.http.get<HistorialProgreso>(`${this.apiUrl}/usuario/${usuarioId}/historial-progreso/mes-actual`);
  }

  /**
   * Actualiza un consumo existente
   * @param id ID del consumo
   * @param comer Datos actualizados
   */
  update(id: number, comer: Comer): Observable<Comer> {
    return this.http.put<Comer>(`${this.apiUrl}/${id}`, comer);
  }

  /**
   * Elimina un consumo
   * @param id ID del consumo
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene un consumo por ID
   * @param id ID del consumo
   */
  getById(id: number): Observable<Comer> {
    return this.http.get<Comer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todos los consumos
   */
  getAll(): Observable<Comer[]> {
    return this.http.get<Comer[]>(this.apiUrl);
  }

  /**
   * Obtiene los consumos de un usuario
   * @param usuarioId ID del usuario
   */
  getByUsuarioId(usuarioId: number): Observable<Comer[]> {
    return this.http.get<Comer[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}

