import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private baseUrl = '/api/solicitud-prestamo';
  constructor(private http: HttpClient) {}

  crear(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
  listarPorOferta(id_oferta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/oferta/${id_oferta}`);
  }
  listarPorPrestamista(id_prestamista: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/prestamista/${id_prestamista}`
    );
  }
  aceptar(id_solicitud: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id_solicitud}/aceptar`, {});
  }
  rechazar(id_solicitud: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id_solicitud}/rechazar`, {});
  }
  yaAplico(id_oferta: number, id_prestatario: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/ya-aplico/${id_oferta}/${id_prestatario}`
    );
  }
}
