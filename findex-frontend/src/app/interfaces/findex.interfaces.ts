export interface User {
  id_usuario: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  telefono: string;
  id_direccion: number;
  email: string;
  fecha_registro: string;
  id_tipo: number;
  estado: boolean;
}

export interface Prestamista {
  id_prestamista: number;
  capital: number;
  id_rango: number;
  estado: boolean;
}

export interface Prestatario {
  id_prestatario: number;
  nombre_negocio: string;
  id_direccion: number;
  ingreso_mensual: number;
  calificacion_crediticia: number;
  estado: boolean;
}

export interface OfertaPrestamo {
  id_oferta: number;
  id_prestamista: number;
  codigo_oferta: string;
  monto: number;
  tasa_interes: number;
  id_frecuencia: number;
  nro_cuotas: number;
  monto_cuota: number;
  fecha_publicacion: string;
  estado: boolean;
}

export interface Prestamo {
  id_prestamo: number;
  id_oferta: number;
  id_prestatario: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: boolean;
}

export interface Pago {
  id_pago: number;
  id_prestamo: number;
  fecha_pago: string;
  monto_pagado: number;
  id_metodo: number;
  comprobante_url: string;
  estado: boolean;
}

export interface Ciudad {
  id_ciudad: number;
  nombre_ciudad: string;
  estado: boolean;
}

export interface Barrio {
  id_barrio: number;
  id_ciudad: number;
  nombre_barrio: string;
  estado: boolean;
}

export interface Direccion {
  id_direccion: number;
  id_barrio: number;
  calle1: string;
  calle2: string;
  estado: boolean;
}

export interface FrecuenciaPago {
  id_frecuencia: number;
  frecuencia_pago: string;
  estado: boolean;
}

export interface MetodoPago {
  id_metodo: number;
  metodo: string;
  estado: boolean;
}

export interface TipoUsuario {
  id_tipo: number;
  tipo: string;
  estado: boolean;
}

export interface Rango {
  id_rango: number;
  rango: string;
  estado: boolean;
}

export interface LoginRequest {
  email: string;
  contraseña: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    tipo: number;
  };
}

export interface RegisterRequest {
  email: string;
  contraseña: string;
}
