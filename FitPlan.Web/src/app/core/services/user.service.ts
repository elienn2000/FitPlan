import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl = 'https://localhost:7187/api/User'; // Assicurati che sia la porta corretta
    
    constructor(private http: HttpClient) { }
    
    // Update the description of the user profile
    updateDescription(description: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/Me/Description`, { description });
    }
    
}