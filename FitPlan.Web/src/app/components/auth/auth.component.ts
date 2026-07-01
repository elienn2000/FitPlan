import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  authForm: FormGroup;
  isLogin = true; // Toggle per passare da Login a Register

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
        console.log('Login effettuato!', res);
      });
    } else {
      this.authService.register(this.authForm.value).subscribe(res => {
        console.log('Utente creato!');
        this.isLogin = true; // Torna al login dopo la registrazione
      });
    }
  }
}