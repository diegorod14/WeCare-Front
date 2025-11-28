import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Nutricionista } from '../model/nutricionista';

@Injectable({
  providedIn: 'root'
})
export class NutricionistaService {
  private url = environment.apiUrl;
  private httpClient: HttpClient = inject(HttpClient);
  private listaCambio: Subject<Nutricionista[]> = new Subject<Nutricionista[]>();

  constructor() { }

  findAll(): Observable<Nutricionista[]> {
    return this.httpClient.get<Nutricionista[]>(this.url + "/nutricionistas");
  }

  listId(id: number): Observable<Nutricionista> {
    console.log(this.url + "/nutricionista/" + id);
    return this.httpClient.get<Nutricionista>(this.url + "/nutricionista/" + id);
  }

  insert(nutricionista: Nutricionista): Observable<Nutricionista> {
    console.log(nutricionista);
    return this.httpClient.post<Nutricionista>(this.url + "/nutricionista", nutricionista);
  }

  update(nutricionista: Nutricionista): Observable<Nutricionista> {
    return this.httpClient.put<Nutricionista>(this.url + "/nutricionista", nutricionista);
  }

  setLista(listaNueva: Nutricionista[]) {
    this.listaCambio.next(listaNueva);
  }

  getListaCambio(): Observable<Nutricionista[]> {
    return this.listaCambio.asObservable();
  }

  actualizarLista(): void {
    this.findAll().subscribe({
      next: (data: Nutricionista[]) => this.setLista(data),
      error: (err: any) => console.error('Error actualizando lista', err)
    });
  }
}
