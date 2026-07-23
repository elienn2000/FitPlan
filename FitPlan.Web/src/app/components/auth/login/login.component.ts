import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {  ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationIconComponent } from '../../shared/validation-icon/validation-icon.component';
import { Router } from '@angular/router';
import{MessageService} from '../../../core/services/message.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ValidationIconComponent],
})
export class LoginComponent {
    
    @Output() switchMode = new EventEmitter<void>();
    
    // injection of the services
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    
    showPassword = false;
    
    loginForm = this.fb.group({
        username_email: ['', Validators.required],
        password: ['', Validators.required]
    });
    
    constructor(private router: Router, private messageService: MessageService) {}
    
    
    submitLogin() {
        if (this.loginForm.valid) {
            
            const loginInput = this.loginForm.value.username_email;
            
            const payload = {
                [loginInput?.includes('@') ? 'email' : 'username']: loginInput,
                password: this.loginForm.value.password
            };
            
            this.authService.login(payload).subscribe({
                next: (response) => {
                    this.messageService.show('success', 'Login successful');
                    this.redirectToDashboard();
                },
                error: (error) => {
                    this.messageService.show('error', 'Login failed. Please check your credentials and try again.');
                    // Handle login error, e.g., show error message
                }
            });
        }
    }
    
    redirectToDashboard() {
        // Redirect to dashboard
        this.router.navigate(['/app/dashboard']);
    }
    
    onSwitchMode() {
        this.switchMode.emit();
    }
    
    // registerForm = this.fb.group({
    //     // STEP 1
    //     account: this.fb.group({
    //         username: ['', {
    //             validators: [Validators.required, Validators.minLength(3)],
    //             asyncValidators: [this.usernameAsyncValidator()]
    //         }]
    //         ,
    //         email: ['', {
    //             validators: [Validators.required, Validators.email],
    //             asyncValidators: [this.emailAsyncValidator()]
    //         }],
    //         birthDate: ['', [Validators.required, this.minAgeValidator(18)]],
    //     }),
    //     // STEP 2
    //     personal: this.fb.group({
    //         firstName: ['', Validators.required],
    //         lastName: ['', Validators.required],
    //         country: ['', Validators.required]
    //     }),
    //     // STEP 3
    //     security: this.fb.group({
    //         password: ['', [Validators.required, Validators.minLength(8)]],
    //         confirmPassword: ['', [Validators.required, this.matchOtherValidator('password')]]
    //     }),
    //     // STEP 4 (Optional)
    //     profile: this.fb.group({
    //         description: ['']
    //     })
    // });
}