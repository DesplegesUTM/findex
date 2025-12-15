import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pagos {
  baseUrl = '/api';

  constructor(private http: HttpClient) {}
  /**
   * Obtener pagos de todos los préstamos de un prestatario
   */
  obtenerPagosPorPrestamo(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pago/pagos-prestamo/${id}`);
  }

  /**
   * Obtener pagos por prestatario
   */
  obtenerPagosPorPrestatario(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pago/pagos-prestatario/${id}`);
  }

  crearPago(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pago`, data);
  }

  //mas adelante se va a acerar un servicio propio para los metodos de pago pero sera un dashboard para el usuario administrador
  metodoPago(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metodo-pago`);
  }
}
