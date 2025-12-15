import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class Direccion {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  obtenerCiudades(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ciudad`);
  }
  obtenerBarrios(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/barrio/ciudad/${id}`);
  }

  obtenerCalles1(): Observable<any> {
    return this.http.get(`${this.baseUrl}/direccion/calles1/all`);
  }

  obtenerCalles2(): Observable<any> {
    return this.http.get(`${this.baseUrl}/direccion/calles2/all`);
  }

  obtenerDireccionesPorBarrio(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/direccion/barrio/${id}`);
  }

  obtenerDireccionCompleta(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/direccion/completa/${id}`);
  }

  registrarDireccion(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/direccion`, data);
  }
}
