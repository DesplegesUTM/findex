import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class Rango {
  private baseUrl = environment.apiUrl; // Cambia esto según tu configuración de API
  constructor(private http: HttpClient) {}

  obtenerRangos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rango`);
  }
}
