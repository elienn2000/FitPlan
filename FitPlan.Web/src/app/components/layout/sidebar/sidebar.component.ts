import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {}