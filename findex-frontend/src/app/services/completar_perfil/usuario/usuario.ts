import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuario/${id}`);
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/${id}`, data);
  }

  cambiarTipo(id: number, payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/usuario/${id}/cambiar-tipo`,
      payload
    );
  }
}
