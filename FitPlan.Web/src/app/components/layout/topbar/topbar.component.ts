// topbar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  onToggle() {
    this.toggleMenu.emit();
  }
}