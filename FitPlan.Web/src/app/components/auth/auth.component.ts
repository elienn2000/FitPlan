import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import{MessageService} from '../../services/message.service';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  authForm: FormGroup;
  isLogin = true; // Toggle per passare da Login a Register
  
  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: [''], // Solo per registrazione
      lastName: ['']   // Solo per registrazione
    });
  }
  
  onSubmit() {
    if (this.isLogin) {
      this.authService.login(this.authForm.value).subscribe(res => {
        this.messageService.show('success', 'Bentornato! Login effettuato.');
      }, error => {
        
        if (error.status === 401) {
          this.messageService.show('error', 'Email o password non valide.');
        } else {
          this.messageService.show('error', 'Si è verificato un errore di rete.');
        }
      }
    );
  } else {
    this.authService.register(this.authForm.value).subscribe(res => {
      console.log('Utente creato!');
      this.isLogin = true; 
    });
  }
}
}