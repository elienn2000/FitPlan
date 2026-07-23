import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onLogout() {
    // Token destroyed and user session cleared
    this.authService.logout();
    
    // Redirect to the login page
    this.router.navigate(['/auth']);
  }
}