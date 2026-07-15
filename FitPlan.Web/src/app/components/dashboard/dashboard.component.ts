import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  
  // Dati fittizi per popolare le card
  kpiStats = [
    { 
      label: 'Giacenze Totali', 
      value: '14.230', 
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-600',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' // Cubo (Box)
    },
    { 
      label: 'Stato Celle (Attive)', 
      value: '8 / 8', 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-600',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // Check circle
    },
    { 
      label: 'Latenza API .NET', 
      value: '42 ms', 
      bgColor: 'bg-purple-100', 
      textColor: 'text-purple-600',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' // Fulmine
    }
  ];
}