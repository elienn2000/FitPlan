import { Routes } from '@angular/router';
import {AuthComponent} from './components/auth/auth.component';
import { AuthLayoutComponent } from './components/auth/auth-layout.component';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'auth', component: AuthComponent },
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
    ]
  },
  
   {
     path: 'app',
     component: MainLayoutComponent,
     canActivate: [authGuard],
     children: [
       { path: 'dashboard', component: DashboardComponent },
       // Altre pagine dell'app: { path: 'profile', component: ProfileComponent }
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
     ]
   },
   { path: '**', redirectTo: 'auth' },
  // domani:
  // { path: 'app', component: MainLayoutComponent, canActivate: [authGuard], children: [...] }
];