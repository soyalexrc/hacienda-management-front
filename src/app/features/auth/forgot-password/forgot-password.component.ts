import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {ForgotPasswordForm} from "../../../core/interfaces/auth";
import {AuthService} from "../../../core/services/auth.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      RouterLink,
      NgClass
    ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit{
  form!: FormGroup<ForgotPasswordForm>;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService)
  private router = inject(Router);
  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
    })
  }

  getFieldError(field: keyof ForgotPasswordForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }

  recoverAccess() {
  }
}
