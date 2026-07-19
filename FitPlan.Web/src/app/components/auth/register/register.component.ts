import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, finalize, switchMap, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, AsyncValidatorFn, ValidatorFn } from '@angular/forms';


import { ValidationIconComponent } from '../../shared/validation-icon/validation-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Importa l'array da un file separato nella realtà
const COUNTRIES = ['Italy', 'Spain', 'France', 'Germany', 'United States', 'United Kingdom'];



@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ValidationIconComponent],
})
export class RegisterComponent {


    // injection of the services
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);


    // async check loading variables
    isUsernameChecking = false;
    isEmailChecking = false;

    currentStep = 1;
    countries = COUNTRIES;
    isSubmitting = false;
    registrationSuccess = false;

    registerForm = this.fb.group({
        // STEP 1
        account: this.fb.group({
            username: ['', {
                validators: [Validators.required, Validators.minLength(3)],
                asyncValidators: [this.usernameAsyncValidator()]
            }]
            ,
            email: ['', {
                validators: [Validators.required, Validators.email],
                asyncValidators: [this.emailAsyncValidator()]
            }],
            birthDate: ['', [Validators.required, this.minAgeValidator(18)]],
        }),
        // STEP 2
        personal: this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            country: ['', Validators.required]
        }),
        // STEP 3
        security: this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, this.matchOtherValidator('password')]]
        }),
        // STEP 4 (Optional)
        profile: this.fb.group({
            description: ['']
        })
    });


    constructor() {
        this.securityForm.get('password')!.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
                this.securityForm.get('confirmPassword')!.updateValueAndValidity();
            });
    }

    // Password validator
    matchOtherValidator(otherControlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) return null; // al primo giro il parent non c'è ancora

            const other = control.parent.get(otherControlName);
            if (!other) return null;

            return control.value === other.value
                ? null
                : { mismatch: { message: 'The passwords do not match' } };
        };
    }

    // Useful getters for easier access to form groups
    get accountForm() { return this.registerForm.get('account') as FormGroup; }
    get personalForm() { return this.registerForm.get('personal') as FormGroup; }
    get securityForm() { return this.registerForm.get('security') as FormGroup; }
    get profileForm() { return this.registerForm.get('profile') as FormGroup; }

    nextStep() {
        if (this.currentStep === 1 && this.accountForm.valid) this.currentStep++;
        else if (this.currentStep === 2 && this.personalForm.valid) this.currentStep++;
    }

    prevStep() {
        if (this.currentStep > 1) this.currentStep--;
    }

    submitRegistration() {
        if (this.currentStep === 3 && this.securityForm.valid) {
            this.isSubmitting = true;

            // Combine all form data into a single payload
            const payload = {
                ...this.accountForm.value,
                ...this.personalForm.value,
                password: this.securityForm.value.password
            };

            // Call the AuthService to register the user
            this.authService.register(payload).pipe(
                finalize(() => this.isSubmitting = false)
            ).subscribe({
                next: (res) => {
                    console.log('Registration successful:', res);
                    this.registrationSuccess = true;
                    this.currentStep++;
                },
                error: (err) => {
                    console.error('Registration failed:', err);
                    // qui eventuale messaggio d'errore in UI
                }
            });

        }
    }

    submitDescription() {
        const description = this.profileForm.value.description;
        // Redirect login  or dashboard todo
    }

    skipDescription() {
        // Redirect login  or dashboard todo
    }

    // Async checks

    // Username availability check
    usernameAsyncValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }
            return timer(500).pipe(
                switchMap(() => this.authService.checkUsernameAvailability(control.value)),
                map((answer: any) => {
                    const isAvailable = answer.isAvailable;
                    return isAvailable ? null : { message: 'Username already taken' };
                }),
                catchError(() => of(null)),
                take(1)
            );
        };
    }

    // Email availability check
    emailAsyncValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }
            return timer(500).pipe(
                switchMap(() => this.authService.checkEmailAvailability(control.value)),
                map((answer: any) => {
                    const isAvailable = answer.isAvailable;
                    return isAvailable ? null : { message: 'Email already taken' };
                }),
                catchError(() => of(null)),
                take(1)
            );
        };
    }


    minAgeValidator(minAge: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;

            const birthDate = new Date(control.value);
            if (isNaN(birthDate.getTime())) return { invalidDate: { message: 'Data non valida' } };

            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age >= minAge
                ? null
                : { minAge: { message: `Devi avere almeno ${minAge} anni` } };
        };
    }
}