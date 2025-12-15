import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendario',
  imports: [NgClass, CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  @Input() mes: number = 4; // Mayo (0-indexado)
  @Input() anio: number = 2025;

  diasSemana = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  calendarDays: { dia: number; actual: boolean }[] = [];
  selectedDay: number | null = null;

  ngOnInit() {
    this.generarCalendario();
  }

  generarCalendario() {
    const fechaInicio = new Date(this.anio, this.mes, 1);
    const diaSemanaInicio = (fechaInicio.getDay() + 6) % 7; // Lunes = 0
    const diasEnMes = new Date(this.anio, this.mes + 1, 0).getDate();

    const totalCeldas = 42;
    this.calendarDays = [];

    for (let i = 0; i < totalCeldas; i++) {
      const dia = i - diaSemanaInicio + 1;
      if (dia > 0 && dia <= diasEnMes) {
        this.calendarDays.push({ dia, actual: true });
      } else {
        this.calendarDays.push({ dia: 0, actual: false });
      }
    }
  }

  seleccionarDia(dia: number) {
    if (dia > 0) this.selectedDay = dia;
  }
}
