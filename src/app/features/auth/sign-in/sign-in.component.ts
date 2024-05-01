import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginForm, RegisterForm} from "../../../core/interfaces/auth";
import {NgClass} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";
import {SpinnerComponent} from "../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    SpinnerComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit{
  form!: FormGroup<LoginForm>;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService)
  isSubmitting = false;
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
    this.isSubmitting = true;
    const {username, password} = this.form.value;
    this.auth.signIn(username!, password!).subscribe(result => {
      sessionStorage.setItem('isLoggedIn', String(true));
      sessionStorage.setItem('currentUser', JSON.stringify(result));
      this.auth.updateCurrentUser(result);
      this.router.navigate(['/']);
    }, () => {

    }, () => {
      this.isSubmitting = false;
    });
  }
}
