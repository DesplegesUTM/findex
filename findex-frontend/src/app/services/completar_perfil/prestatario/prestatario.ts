import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class Prestatario {
  private baseUrl = environment.apiUrl; // Cambia esto según tu configuración de API

  constructor(private http: HttpClient) {}

  obtenerPrestatario(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/prestatario/${id}`);
  }

  actualizarPrestatario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/prestatario/perfil/${id}`, data);
  }

  crearPerfilInicial(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/prestatario/crear-perfil-inicial`,
      data
    );
  }
}
