import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ChangePasswordForm } from '../../../../core/interfaces/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  form!: FormGroup<ChangePasswordForm>;
  step = 1;
  loading = false;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService)
  ngOnInit() {
    this.form = this.fb.group({
      currentPass: [''],
      newPass: ['', Validators.required],
    })

    this.form.get('currentPass')?.disable();
    this.form.get('currentPass')?.setValue(this.auth.getCurrentUser.mainUser.password)
  }

  getFieldError(field: keyof ChangePasswordForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }


  changePassword() {
    this.loading = true
    const assetId = this.auth.getCurrentUser.mainUser.assetID;
    this.auth.changePassword(assetId, this.newPass!).subscribe(res => {
      console.log(res);
    }, () => {

    }, () => {
      this.loading = false;
    })
  }

  get newPass() {
    return this.form.get('newPass')?.value;
  }

}
