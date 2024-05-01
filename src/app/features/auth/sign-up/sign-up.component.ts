import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {RegisterForm} from "../../../core/interfaces/auth";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  form!: FormGroup<RegisterForm>;

  private fb = inject(FormBuilder);

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }

  getFieldError(field: keyof RegisterForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }
}
