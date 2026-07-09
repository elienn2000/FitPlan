import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new BehaviorSubject<ToastMessage | null>(null);
  
  // The observable that components can subscribe to in order to get the current message
  public message$ = this.messageSubject.asObservable();

  // Id for the timeout to clear the message automatically
  private timeoutId: any;

  show(type: 'success' | 'error' | 'info' | 'warning', text: string, duration: number = 3000) {
    this.messageSubject.next({ type, text });
    
    // Clear any existing timeout to avoid multiple messages stacking
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Automatically clear the message after duration milliseconds
    this.timeoutId = setTimeout(() => {
      this.clear();
    }, duration);
  }

  clear() {
    this.messageSubject.next(null);
  }
}