# Findex Frontend (Angular)

Interfaz web para gestionar ofertas, préstamos y pagos.

---

## 🚀 Características principales

- Arquitectura con componentes standalone y Lazy Loading.
- Autenticación JWT, guards por rol (prestamista=1, prestatario=2).
- Registro de pagos con validaciones y carga de comprobante.
- UI con sidebar “acrílico” y diseño responsive.
- Navegación clara: feed, mis préstamos, detalle de préstamo y registrar pago.

Consulta diagramas y flujos en `../ARQUITECTURA.md`.

---

## 📋 Páginas y componentes clave

- `feed` – Descubrimiento de ofertas y estado general (auth requerida).
- `mis-prestamos` – Listado según rol (prestamista/prestatario).
- `detalle-prestamo/:id` – Muestra datos de la oferta y pagos relacionados; resuelve `id_prestamo` del usuario para habilitar “Registrar pago”.
- `registrar-pago/:id` – Formulario para registrar pagos por `id_prestamo`.
- `gestionar-solicitudes` – Gestión para prestamistas (rol 1).
- `perfil` / `editar-perfil` – Perfil de usuario.
- `login` / `register` – Autenticación y registro.

---

## 🗺️ Rutas de la aplicación

| Ruta                     | Descripción                      | Guard |
| ------------------------ | -------------------------------- | ----- |
| `/`                      | Redirección a `/login`           | -     |
| `/login`                 | Autenticación                    | No    |
| `/register`              | Registro de usuarios             | No    |
| `/feed`                  | Inicio autenticado               | Sí    |
| `/mis-prestamos`         | Listado de préstamos             | Sí    |
| `/detalle-prestamo/:id`  | Detalle por id_oferta            | Sí    |
| `/registrar-pago/:id`    | Registrar pago por id_prestamo   | Sí    |
| `/gestionar-solicitudes` | Gestión (prestamista)            | Sí(1) |
| `/perfil`                | Perfil de usuario                | Sí    |
| `/editar-perfil`         | Edición de perfil                | Sí    |
| `/mis-pagos`             | Historial de pagos (prestatario) | Sí(2) |

> Sí(1): requiere rol 1 (prestamista). Sí(2): requiere rol 2 (prestatario).

---

## 🔐 Autenticación

- Token JWT almacenado en `localStorage`.
- Guards: `authGuard` y `roleGuard`.
- Interfaz consume `/api/...` (proxy a backend NestJS durante dev).

---

## 🛠️ Instalación y ejecución

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start
# o
ng serve

# Build de producción
npm run build
```

Abrir `http://localhost:4200/`.

---

## 📁 Estructura del proyecto

```text
src/
├─ app/
│  ├─ components/
│  │  ├─ header/
│  │  └─ pages/
│  │     ├─ feed/
│  │     ├─ mis-prestamos/
│  │     ├─ detalle-prestamo/
│  │     ├─ registrar-pago/
│  │     ├─ gestionar-solicitudes/
│  │     ├─ perfil/ editar-perfil/
│  │     └─ login/ register/
│  ├─ services/
│  │  ├─ prestamo/
│  │  └─ pago/
│  ├─ guards/
│  ├─ interceptors/ (opcional)
│  ├─ app.routes.ts
│  └─ app.config.ts
└─ ...
```

---

## 🔧 Tecnologías

- Angular 20, TypeScript, RxJS, Angular Router.
- CSS con estilos personalizados.

---

## 👥 Créditos

- Kevin Quiroz — Frontend — <https://github.com/triunix>
- Carlos Moreira — UX + Lógica — <https://github.com/cmoreira9255>

Ver también: `../ARQUITECTURA.md`.
