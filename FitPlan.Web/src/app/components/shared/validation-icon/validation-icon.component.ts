import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-validation-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './validation-icon.component.html',
})
export class ValidationIconComponent implements OnInit {
    @Input() control: AbstractControl | null = null;


    status$!: Observable<string>;

    // Errors mapping
    private static readonly DEFAULT_MESSAGES: Record<string, (err: any) => string> = {
        required: () => 'Required field',
        minlength: (e) => `Min. ${e.requiredLength} characters (current: ${e.actualLength})`,
        maxlength: (e) => `Max. ${e.requiredLength} characters (current: ${e.actualLength})`,
        email: () => 'Invalid email',
        pattern: () => 'Invalid format',
        min: (e) => `Min. value: ${e.min}`,
        max: (e) => `Max. value: ${e.max}`,
        usernameTaken: () => 'Username already taken'
    };

    // Getter for error message
    get errorMessage(): string {
        const errors: ValidationErrors | null = this.control?.errors ?? null;
        if (!errors) return '';

        const key = Object.keys(errors)[0];
        const err = errors[key];

        // If the error has a message property, return it directly
        if (err?.message) return err.message;
        if (typeof err === 'string') return err;

        // Use the default message mapping
        const builder = ValidationIconComponent.DEFAULT_MESSAGES[key];
        return builder ? builder(err) : 'Campo non valido';
    }

    ngOnInit() {
        const ctrl = this.control!;

        this.status$ = combineLatest([
            ctrl.statusChanges.pipe(startWith(ctrl.status)),
            ctrl.valueChanges.pipe(startWith(ctrl.value))
        ]).pipe(
            map(([status, value]) => !value ? 'EMPTY' : status)
        );
    }
}