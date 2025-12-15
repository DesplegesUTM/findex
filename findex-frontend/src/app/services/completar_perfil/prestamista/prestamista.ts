import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Prestamista {
  private baseUrl = '/api'; // Cambia esto según tu configuración de API

  constructor(private http: HttpClient) {}

  obtenerPrestamista(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/prestamista/${id}`);
  }

  actualizarPrestamista(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/prestamista/perfil/${id}`, data);
  }

  crearPerfilInicial(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/prestamista/crear-perfil-inicial`,
      data
    );
  }
}
