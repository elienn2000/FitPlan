import { Routes } from '@angular/router';
import {AuthComponent} from './components/auth/auth.component';
import { AuthLayoutComponent } from './components/auth/authLayout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'auth', component: AuthComponent },
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
    ]
  },
  // domani:
  // { path: 'app', component: MainLayoutComponent, canActivate: [authGuard], children: [...] }
];