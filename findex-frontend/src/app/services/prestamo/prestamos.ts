import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class Prestamos {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  // obtinene todos los prestamos
  // este metodo se usa en el dashboard feed del usuario para ver todos los prestamos
  obtenerPrestamos(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/oferta-prestamo/obtener-prestamos`, {
      headers,
    });
  }

  //obtine solo un prestamo por el id
  obtenerPrestamo(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(
      `${this.baseUrl}/oferta-prestamo/obtener-prestamo/${id}`,
      {
        headers,
      }
    );
  }

  // obtener registro de la tabla prestamo por id_prestamo
  obtenerPrestamoPorIdPrestamo(id_prestamo: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/prestamo/${id_prestamo}`, {
      headers,
    });
  }

  // obtener el préstamo del usuario autenticado para una oferta
  obtenerMiPrestamoPorOferta(id_oferta: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(
      `${this.baseUrl}/prestamo/mi-prestamo-por-oferta/${id_oferta}`,
      { headers }
    );
  }
  //crea un prestamo
  crearPrestamo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/oferta-prestamo/`, data);
  }

  //mas adelante se va a acerar un servicio propio para las frecuencias de pago pero sera un dashboard para el usuario amministrador
  frecuenciaPago(): Observable<any> {
    return this.http.get(`${this.baseUrl}/frecuencia-pago`);
  }
  // end pointe para la vista mis prestsmos pero con usuarios Prestamista tipo 1
  misPrestamosPrestamista(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/prestamo/prestamos-por-prestamista/${id}`
    );
  }
  // end point para la vista mis prestamos pero con usuarios Prestatario tipo 2
  misPrestamosPrestatario(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/prestamo/prestamos-por-prestatario/${id}`
    );
  }

  // ofertas de préstamo creadas por un prestamista (para gestionar solicitudes)
  obtenerOfertasPorPrestamista(id_prestamista: number): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(
      `${this.baseUrl}/oferta-prestamo/mis-ofertas/${id_prestamista}`,
      { headers }
    );
  }

  //esto es para verificar si el codigo generado ya existe en la base de datos
  codigoExiste(codigo: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/oferta-prestamo/validar-codigo/${codigo}`
    );
  }
}
