import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../services/completar_perfil/usuario/usuario';
import { Prestamista } from '../../../services/completar_perfil/prestamista/prestamista';
import { Prestatario } from '../../../services/completar_perfil/prestatario/prestatario';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf, CurrencyPipe, NgClass } from '@angular/common';
import { Direccion } from '../../../services/direccion/direccion';
import { Rango } from '../../../services/rango/rango';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-editar-perfil',
  imports: [FormsModule, NgIf, NgFor, CurrencyPipe, NgClass],
  templateUrl: './editar-perfil.html',
  styleUrls: ['./editar-perfil.css'],
})
export class EditarPerfil implements OnInit {
  ciudades: any[] = [];
  barrios: any[] = [];
  direcciones: any[] = []; // Direcciones del barrio seleccionado del usuario
  rangos: any[] = [];
  prestatario_ciudad: any[] = [];
  prestatario_barrio: any[] = [];
  prestatario_direcciones: any[] = []; // Direcciones del barrio seleccionado del prestatario
  datosUsuario: any = {};
  datosPrestamista: any = {};
  datosPrestatario: any = {};

  // Flags para saber si el usuario tiene datos específicos
  tieneDatosPrestamista: boolean = false;
  tieneDatosPrestatario: boolean = false;
  tipoYaDefinido: boolean = false; // Flag para saber si ya tiene un perfil específico creado
  isLoading: boolean = false;

  id = Number(localStorage.getItem('id'));
  tipo = Number(localStorage.getItem('tipo'));
  originalTipo = this.tipo;
  tipoCambiadoPendiente: boolean = false;

  constructor(
    private usuario: Usuario,
    private prestamista: Prestamista,
    private prestatario: Prestatario,
    private direccion: Direccion,
    private rango: Rango,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  //esto obtiene los datos del usuario y los muestra en el formulario
  ngOnInit() {
    console.log('ID del usuario:', this.id);
    if (!this.id) {
      this.notificationService.showError('No se encontró ID de usuario');
      this.router.navigate(['/login']);
      return;
    }

    this.cargarDatosUsuario();
    this.cargarCiudades();
    this.cargarRangos();
  }

  private cargarDatosUsuario() {
    this.usuario.obtenerUsuario(this.id).subscribe({
      next: (user) => {
        console.log('Datos del usuario obtenidos:', user);
        this.datosUsuario = { ...user };

        // Formatear la fecha para que sea compatible con input type="date"
        if (this.datosUsuario.fecha_nacimiento) {
          const fecha = new Date(this.datosUsuario.fecha_nacimiento);
          // Convertir a formato yyyy-MM-dd para input date
          this.datosUsuario.fecha_nacimiento = fecha
            .toISOString()
            .split('T')[0];
        }

        // Si el usuario ya tiene una dirección, cargar la información completa
        if (this.datosUsuario.id_direccion) {
          this.cargarDireccionCompleta(this.datosUsuario.id_direccion);
        }

        this.cargarDatosEspecificos();
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.notificationService.showError(
          'Error al cargar los datos del usuario'
        );
        this.router.navigate(['/perfil']);
      },
    });
  }

  private cargarCiudades() {
    this.direccion.obtenerCiudades().subscribe({
      next: (ciudades) => {
        console.log('Ciudades cargadas:', ciudades);
        this.ciudades = ciudades;
        this.prestatario_ciudad = ciudades;

        if (ciudades.length > 0) {
          this.cargarBarrios(ciudades[0].id_ciudad, 'inicial').catch(
            (error) => {
              console.error('Error al cargar barrios iniciales:', error);
            }
          );
        }
      },
      error: (error) => {
        console.error('Error al cargar ciudades:', error);
        this.notificationService.showWarning('Error al cargar las ciudades');
      },
    });
  }

  private cargarBarrios(ciudadId: number, tipo: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      this.direccion.obtenerBarrios(ciudadId).subscribe({
        next: (barrios) => {
          console.log(`Barrios cargados para ${tipo}:`, barrios);

          if (tipo === 'prestatario' || tipo === 'inicial') {
            this.prestatario_barrio = barrios;
          }
          if (tipo === 'usuario' || tipo === 'inicial') {
            this.barrios = barrios;
          }
          resolve();
        },
        error: (error) => {
          console.error(`Error al cargar barrios para ${tipo}:`, error);
          reject(error);
        },
      });
    });
  }

  private cargarDirecciones(
    barrioId: number,
    tipo: string = ''
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.direccion.obtenerDireccionesPorBarrio(barrioId).subscribe({
        next: (direcciones) => {
          console.log(`Direcciones cargadas para ${tipo}:`, direcciones);

          if (tipo === 'prestatario') {
            this.prestatario_direcciones = direcciones;
          } else {
            this.direcciones = direcciones;
          }
          resolve();
        },
        error: (error) => {
          console.error(`Error al cargar direcciones para ${tipo}:`, error);
          reject(error);
        },
      });
    });
  }

  private cargarDireccionCompleta(idDireccion: number) {
    this.direccion.obtenerDireccionCompleta(idDireccion).subscribe({
      next: (direccionCompleta) => {
        console.log('Dirección completa del usuario:', direccionCompleta);

        // Cargar los barrios de la ciudad seleccionada
        this.cargarBarrios(direccionCompleta.id_ciudad, 'usuario').then(() => {
          // Después de cargar barrios, cargar las direcciones
          this.cargarDirecciones(direccionCompleta.id_barrio, 'usuario');
        });
      },
      error: (error) => {
        console.error('Error al cargar dirección completa:', error);
        // Si hay error, cargar normalmente sin selecciones previas
        if (this.ciudades.length > 0) {
          this.cargarBarrios(this.ciudades[0].id_ciudad, 'usuario').catch(
            (err) => {
              console.error('Error al cargar barrios de respaldo:', err);
            }
          );
        }
      },
    });
  }

  private cargarDireccionCompletaPrestatario(idDireccion: number) {
    this.direccion.obtenerDireccionCompleta(idDireccion).subscribe({
      next: (direccionCompleta) => {
        console.log('Dirección completa del prestatario:', direccionCompleta);

        // Cargar los barrios de la ciudad seleccionada para prestatario
        this.cargarBarrios(direccionCompleta.id_ciudad, 'prestatario').then(
          () => {
            // Después de cargar barrios, cargar las direcciones
            this.cargarDirecciones(direccionCompleta.id_barrio, 'prestatario');
          }
        );
      },
      error: (error) => {
        console.error(
          'Error al cargar dirección completa del prestatario:',
          error
        );
        // Si hay error, cargar normalmente sin selecciones previas
        if (this.prestatario_ciudad.length > 0) {
          this.cargarBarrios(
            this.prestatario_ciudad[0].id_ciudad,
            'prestatario'
          ).catch((err) => {
            console.error(
              'Error al cargar barrios de respaldo para prestatario:',
              err
            );
          });
        }
      },
    });
  }

  private cargarRangos() {
    this.rango.obtenerRangos().subscribe({
      next: (rangos) => {
        console.log('Rangos cargados:', rangos);
        this.rangos = rangos;
      },
      error: (error) => {
        console.error('Error al cargar rangos:', error);
      },
    });
  }

  private cargarDatosEspecificos() {
    if (this.tipo === 1) {
      // Cargar datos del prestamista
      this.prestamista.obtenerPrestamista(this.id).subscribe({
        next: (extra) => {
          console.log('Datos del prestamista obtenidos:', extra);
          this.datosPrestamista = { ...extra };
          this.tieneDatosPrestamista = true;
          this.tipoYaDefinido = true; // Ya tiene perfil de prestamista creado
        },
        error: (error) => {
          console.log('Usuario no tiene perfil de prestamista completado');
          // No cambiar tieneDatosPrestamista si ya está en true (usuario nuevo)
          if (!this.tieneDatosPrestamista) {
            this.tieneDatosPrestamista = false;
          }
          // Mantener objeto vacío para que se pueda llenar
          if (
            !this.datosPrestamista ||
            Object.keys(this.datosPrestamista).length === 0
          ) {
            this.datosPrestamista = {};
          }
        },
      });
    } else if (this.tipo === 2) {
      // Cargar datos del prestatario
      this.prestatario.obtenerPrestatario(this.id).subscribe({
        next: (extra) => {
          console.log('Datos del prestatario obtenidos:', extra);
          this.datosPrestatario = { ...extra };
          this.tieneDatosPrestatario = true;
          this.tipoYaDefinido = true; // Ya tiene perfil de prestatario creado

          // Si el prestatario ya tiene una dirección, cargar la información completa
          if (this.datosPrestatario.id_direccion) {
            this.cargarDireccionCompletaPrestatario(
              this.datosPrestatario.id_direccion
            );
          }
        },
        error: (error) => {
          console.log('Usuario no tiene perfil de prestatario completado');
          // No cambiar tieneDatosPrestatario si ya está en true (usuario nuevo)
          if (!this.tieneDatosPrestatario) {
            this.tieneDatosPrestatario = false;
          }
          // Mantener objeto vacío para que se pueda llenar
          if (
            !this.datosPrestatario ||
            Object.keys(this.datosPrestatario).length === 0
          ) {
            this.datosPrestatario = {};
          }
        },
      });
    }
  }

  guardarCambios() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.notificationService.showInfo('Guardando cambios...');

    // Limpiar datos nulos o indefinidos antes de enviar
    const datosLimpios = this.limpiarDatosUsuario();
    console.log('Datos a enviar:', datosLimpios);

    // Actualizar datos del usuario (siempre existe)
    this.usuario.actualizarUsuario(this.id, datosLimpios).subscribe({
      next: (response) => {
        console.log('Datos de usuario actualizados:', response);
        this.guardarDatosEspecificos();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.isLoading = false;

        let errorMessage = 'Error al actualizar los datos del usuario';

        // Manejar errores específicos
        if (error.status === 409) {
          // Conflict - datos duplicados
          if (error.error?.field === 'telefono') {
            errorMessage =
              'El número de teléfono ya está registrado por otro usuario';
          } else if (error.error?.field === 'email') {
            errorMessage = 'El email ya está registrado por otro usuario';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
        } else if (error.status === 400 && error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.notificationService.showError(errorMessage);
      },
    });
  }

  private limpiarDatosUsuario() {
    const datos: any = {};

    // Solo incluir campos que tienen valores válidos
    if (this.datosUsuario.nombre && this.datosUsuario.nombre.trim()) {
      datos.nombre = this.datosUsuario.nombre.trim();
    }

    if (this.datosUsuario.apellido && this.datosUsuario.apellido.trim()) {
      datos.apellido = this.datosUsuario.apellido.trim();
    }

    if (this.datosUsuario.telefono && this.datosUsuario.telefono.trim()) {
      datos.telefono = this.datosUsuario.telefono.trim();
    }

    if (this.datosUsuario.email && this.datosUsuario.email.trim()) {
      datos.email = this.datosUsuario.email.trim();
    }

    if (this.datosUsuario.fecha_nacimiento) {
      datos.fecha_nacimiento = this.datosUsuario.fecha_nacimiento;
    }

    // Solo incluir id_direccion si existe, no id_ciudad ni id_barrio
    // porque estos campos no existen en la tabla usuario
    if (this.datosUsuario.id_direccion) {
      datos.id_direccion = Number(this.datosUsuario.id_direccion);
    }

    // Actualizar tipo si cambió (comparar contra datosUsuario original si existe)
    const tipoLocalStorage = Number(localStorage.getItem('tipo'));
    if (this.tipo !== tipoLocalStorage) {
      datos.id_tipo = this.tipo; // backend debe aceptar id_tipo
    }

    return datos;
  }

  private guardarDatosEspecificos() {
    // Actualizar el tipo en localStorage si cambió
    const tipoAnterior = Number(localStorage.getItem('tipo'));
    const cambioTipo = this.tipo !== tipoAnterior;

    if (cambioTipo) {
      localStorage.setItem('tipo', this.tipo.toString());
    }

    // Si cambió el tipo usar endpoint unificado y salir
    if (cambioTipo) {
      const payload: any = { nuevo_tipo: this.tipo };
      if (this.tipo === 1) {
        payload.capital = Number(this.datosPrestamista.capital) || 0;
      } else if (this.tipo === 2) {
        payload.nombre_negocio = this.datosPrestatario.nombre_negocio || '';
        payload.ingreso_mensual = Number(
          this.datosPrestatario.ingreso_mensual || 0
        );
        payload.id_direccion = this.datosPrestatario.id_direccion || 1;
      }
      this.usuario.cambiarTipo(this.id, payload).subscribe({
        next: (resp) => {
          console.log('Cambio de tipo realizado', resp);
          this.finalizarGuardado();
        },
        error: (err) => {
          console.error('Error al cambiar tipo', err);
          this.manejarErrorGuardado('tipo');
        },
      });
      return;
    }

    // Si no cambió el tipo, continuar con actualizaciones específicas existentes
    if (this.tipo === 1) {
      const datosPrestamista = this.limpiarDatosPrestamista();
      if (Object.keys(datosPrestamista).length > 0) {
        this.prestamista
          .actualizarPrestamista(this.id, datosPrestamista)
          .subscribe({
            next: () => this.finalizarGuardado(),
            error: () => this.manejarErrorGuardado('prestamista'),
          });
      } else {
        this.finalizarGuardado();
      }
    } else if (this.tipo === 2) {
      const datosPrestatario = this.limpiarDatosPrestatario();
      if (Object.keys(datosPrestatario).length > 0) {
        this.prestatario
          .actualizarPrestatario(this.id, datosPrestatario)
          .subscribe({
            next: () => this.finalizarGuardado(),
            error: () => this.manejarErrorGuardado('prestatario'),
          });
      } else {
        this.finalizarGuardado();
      }
    } else {
      this.finalizarGuardado();
    }
  }

  private limpiarDatosPrestamista() {
    const datos: any = {};

    if (this.datosPrestamista.capital && this.datosPrestamista.capital > 0) {
      datos.capital = Number(this.datosPrestamista.capital);
    }

    // No incluir id_rango - se calcula automáticamente en el backend

    if (typeof this.datosPrestamista.estado === 'boolean') {
      datos.estado = this.datosPrestamista.estado;
    }

    return datos;
  }

  private limpiarDatosPrestatario() {
    const datos: any = {};

    if (
      this.datosPrestatario.nombre_negocio &&
      this.datosPrestatario.nombre_negocio.trim()
    ) {
      datos.nombre_negocio = this.datosPrestatario.nombre_negocio.trim();
    }

    if (this.datosPrestatario.id_direccion) {
      datos.id_direccion = Number(this.datosPrestatario.id_direccion);
    }

    if (
      this.datosPrestatario.ingreso_mensual &&
      this.datosPrestatario.ingreso_mensual > 0
    ) {
      datos.ingreso_mensual = Number(this.datosPrestatario.ingreso_mensual);
    }

    if (
      this.datosPrestatario.calificacion_crediticia &&
      this.datosPrestatario.calificacion_crediticia.trim()
    ) {
      datos.calificacion_crediticia =
        this.datosPrestatario.calificacion_crediticia.trim();
    }

    if (typeof this.datosPrestatario.estado === 'boolean') {
      datos.estado = this.datosPrestatario.estado;
    }

    return datos;
  }

  private finalizarGuardado() {
    this.isLoading = false;
    // Marcar que el tipo ya está definido después de guardar exitosamente
    this.tipoYaDefinido = true;
    // Si se cambió el tipo respecto al original, sugerir reinicio de sesión
    if (this.tipoCambiadoPendiente) {
      this.notificationService.showWarning(
        'Tipo cambiado. Cierra sesión y vuelve a entrar para actualizar permisos.'
      );
      // Actualizar localStorage mínimo para que UI muestre nuevas opciones, pero recomendar logout
      localStorage.setItem('tipo', String(this.tipo));
    } else {
      this.notificationService.showSuccess(
        '¡Perfil actualizado correctamente!'
      );
    }
    setTimeout(() => {
      this.router.navigate(['/perfil']);
    }, 1800);
  }

  private manejarErrorGuardado(tipo: string) {
    this.isLoading = false;
    this.notificationService.showError(
      `Error al actualizar los datos de ${tipo}`
    );
  }

  //función para obtener los barrios de acuerdo a las ciudades que se selecciona en el select
  actualizarBarrios(event: Event, tipo: string = '') {
    const ciudadId = Number((event.target as HTMLSelectElement).value);

    if (!ciudadId) {
      console.warn('ID de ciudad inválido');
      return;
    }

    if (tipo === 'usuario') {
      this.cargarBarrios(ciudadId, 'usuario').catch((error) => {
        console.error('Error al cargar barrios:', error);
      });
      // Resetear selección de barrio cuando cambia la ciudad
      this.datosUsuario.id_barrio = null;
      this.direcciones = []; // Limpiar direcciones
    } else if (tipo === 'prestatario') {
      this.cargarBarrios(ciudadId, 'prestatario').catch((error) => {
        console.error('Error al cargar barrios:', error);
      });
      // Resetear selección de barrio cuando cambia la ciudad
      this.datosPrestatario.id_barrio = null;
      this.prestatario_direcciones = []; // Limpiar direcciones
    }
  }

  //función para obtener las direcciones de acuerdo al barrio seleccionado
  actualizarDirecciones(event: Event, tipo: string = '') {
    const barrioId = Number((event.target as HTMLSelectElement).value);

    if (!barrioId) {
      console.warn('ID de barrio inválido');
      return;
    }

    if (tipo === 'usuario') {
      this.cargarDirecciones(barrioId, 'usuario').catch((error) => {
        console.error('Error al cargar direcciones:', error);
      });
      // Resetear selección de dirección cuando cambia el barrio
      this.datosUsuario.id_direccion = null;
    } else if (tipo === 'prestatario') {
      this.cargarDirecciones(barrioId, 'prestatario').catch((error) => {
        console.error('Error al cargar direcciones:', error);
      });
      // Resetear selección de dirección cuando cambia el barrio
      this.datosPrestatario.id_direccion = null;
    }
  }

  // Método para manejar el cambio de tipo de usuario
  onTipoChange() {
    // Asegurar que el tipo sea un número
    this.tipo = Number(this.tipo);
    console.log('Tipo de usuario cambiado a:', this.tipo);
    this.tipoCambiadoPendiente = this.tipo !== this.originalTipo;

    // Resetear flags
    this.tieneDatosPrestamista = false;
    this.tieneDatosPrestatario = false;

    // Limpiar datos específicos
    this.datosPrestamista = {};
    this.datosPrestatario = {};

    // Para usuarios nuevos, mostrar siempre la sección correspondiente
    if (this.tipo === 1) {
      this.tieneDatosPrestamista = true; // Mostrar sección aunque no tenga datos
      console.log('Establecido tieneDatosPrestamista = true');
    } else if (this.tipo === 2) {
      this.tieneDatosPrestatario = true; // Mostrar sección aunque no tenga datos
      console.log('Establecido tieneDatosPrestatario = true');
    }

    // Cargar datos específicos según el nuevo tipo (si existen)
    this.cargarDatosEspecificos();
  }

  volver() {
    if (this.isLoading) {
      this.notificationService.showWarning(
        'Espera a que se guarden los cambios antes de salir'
      );
      return;
    }

    window.history.back();
  }

  // Método para validar campos requeridos
  validarFormulario(): boolean {
    if (
      !this.datosUsuario.nombre ||
      !this.datosUsuario.apellido ||
      !this.datosUsuario.email
    ) {
      this.notificationService.showWarning(
        'Por favor completa los campos obligatorios del usuario'
      );
      return false;
    }

    // Validaciones específicas según el tipo
    if (this.tipo === 1) {
      // Validaciones para prestamista
      if (this.tieneDatosPrestamista && !this.datosPrestamista.capital) {
        this.notificationService.showWarning(
          'Por favor completa el capital disponible'
        );
        return false;
      }
    } else if (this.tipo === 2) {
      // Validaciones para prestatario
      if (
        this.tieneDatosPrestatario &&
        (!this.datosPrestatario.ingreso_mensual ||
          this.datosPrestatario.ingreso_mensual <= 0)
      ) {
        this.notificationService.showWarning(
          'Por favor completa los ingresos mensuales'
        );
        return false;
      }
    }

    return true;
  }

  // Método para guardar con validación
  guardarConValidacion() {
    if (this.validarFormulario()) {
      this.guardarCambios();
    }
  }

  // Método para obtener el nombre del rango por ID
  obtenerNombreRango(idRango: number): string {
    if (!idRango || !this.rangos.length) {
      return 'Sin rango asignado';
    }

    const rango = this.rangos.find((r) => r.id_rango === idRango);
    return rango ? rango.rango : 'Rango desconocido';
  }
}
