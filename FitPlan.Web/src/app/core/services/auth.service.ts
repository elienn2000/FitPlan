import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'https://localhost:7187/api/Auth'; // Assicurati che sia la porta corretta
  
  // Gestiamo lo stato dell'autenticazione globalmente
  private authSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('accessToken'));
  isLoggedIn$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 1. Registrazione
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, userData);
  }

  // 2. Login (Riceve Access e Refresh Token)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, credentials)
      .pipe(
        tap(response => {
          // Salviamo i token
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.authSubject.next(true);
        })
      );
  }

  // 3. Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authSubject.next(false);
  }

  // 4. Getter per il token attuale (utile per l'interceptor)
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}