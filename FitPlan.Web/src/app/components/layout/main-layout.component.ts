
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, FooterComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  // Gestisce lo stato della sidebar su schermi piccoli
  isMobileSidebarOpen = false;

  toggleSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
}