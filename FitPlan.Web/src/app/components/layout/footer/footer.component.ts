import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  // Un piccolo tocco dinamico per avere l'anno sempre aggiornato
  currentYear = new Date().getFullYear();
}