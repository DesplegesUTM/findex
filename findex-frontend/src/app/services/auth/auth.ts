import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; contraseña: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        console.log('Respuesta del servidor de login:', response);
        if (response && response.token) {
          console.log('Guardando datos en localStorage...');
          localStorage.setItem('token', response.token);
          localStorage.setItem('id', response.user.id.toString());
          localStorage.setItem('tipo', response.user.tipo.toString());

          console.log('Datos guardados:', {
            token: localStorage.getItem('token'),
            id: localStorage.getItem('id'),
            tipo: localStorage.getItem('tipo'),
          });

          console.log('Login exitoso - Usuario autenticado:', {
            id: response.user.id,
            tipo: response.user.tipo,
            email: response.user.email,
          });
        } else {
          console.log('Respuesta del login no contiene token válido');
        }
      })
    );
  }

  register(data: { email: string; contraseña: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('tipo');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('id');
    return id ? Number(id) : null;
  }

  getUserType(): number | null {
    const tipo = localStorage.getItem('tipo');
    return tipo ? Number(tipo) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const hasToken = !!token;
    console.log('Auth.isAuthenticated() - Token:', token ? 'EXISTS' : 'NULL');
    console.log('Auth.isAuthenticated() - Resultado:', hasToken);
    return hasToken;
  }

  hasRole(role: number): boolean {
    const userRole = this.getUserType();
    return userRole === role;
  }

  isPrestamista(): boolean {
    return this.hasRole(1);
  }

  isPrestatario(): boolean {
    return this.hasRole(2);
  }

  isAdmin(): boolean {
    return this.hasRole(3);
  }
}
