import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerPagosPorOferta(id_oferta: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/pago/pagos-oferta/${id_oferta}`, {
      headers,
    });
  }
}
