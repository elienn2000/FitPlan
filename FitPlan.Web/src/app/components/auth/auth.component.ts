import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';
import { Router } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import{LoginComponent} from './login/login.component';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  authForm: FormGroup;
  isLogin = true; // Toggle between login and registration
  showPassword = false; // Toggle for password visibility
  
  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: [''], // Only for registration
      lastName: ['']   // Only for registration
    });
  }
  
  onSubmit() {
    if (this.isLogin) {
      this.authService.login(this.authForm.value).subscribe(res => {
        this.messageService.show('success', 'Bentornato! Login effettuato.');
        
        // Handle successful login, e.g., redirect to dashboard
        this.router.navigate(['/app/dashboard']);
      }, error => {
        
        if (error.status === 401) {
          this.messageService.show('error', 'Email or password not valid.');
        } else {
          this.messageService.show('error', 'A network error occurred.');
        }
      }
    );
  } else {
    this.authService.register(this.authForm.value).subscribe(res => {
      console.log('Registration successful:', res);
      this.isLogin = true;
    });
  }
}

toggleAuthMode() {
  this.isLogin = !this.isLogin;
}
}