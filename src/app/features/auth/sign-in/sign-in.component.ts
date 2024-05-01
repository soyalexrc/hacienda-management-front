import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginForm, RegisterForm} from "../../../core/interfaces/auth";
import {NgClass} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";
import {LOGIN_MOCK} from "../../../shared/utils/data";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit{
  form!: FormGroup<LoginForm>;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService)
  private router = inject(Router);
  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  getFieldError(field: keyof RegisterForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }

  login() {
    this.auth.signIn(LOGIN_MOCK);
    this.router.navigate(['/']);
  }
}
