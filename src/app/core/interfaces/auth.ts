import {FormControl} from "@angular/forms";

export interface RegisterForm {
  name: FormControl<string | null>;
  lastname: FormControl<string | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface ForgotPasswordForm {
  username: FormControl<string | null>;
  newPass: FormControl<string | null>;
}

export interface ChangePasswordForm {
  currentPass: FormControl<string | null>;
  newPass: FormControl<string | null>;
}

export interface LoginResult {
  mainUser: User;
  secondaryUser: User[];
  hasError: boolean;
  errorDisplay: string;
  errorDesc: string;
  errorNum: number;
  errorSubject: string;
  message: string;
}

export interface User {
  assetID: number;
  roleID: number;
  password: string;
  email: string;
  name: string;
  initial: string;
  lastname: string;
  lastname2: string;
  add1: string;
  add2: string;
  city: string;
  zip: string;
  phone: string;
  company_name: string;
  status: boolean;
  createdDate: string;
  locked: boolean;
  lastupDate: string;
  company: number;
  updatedby: string;
  primaryofficerid: number;
  deleteddate: string;
  prmaryofficer: boolean;
  lastLogin: string;
  failedAttemps: number;
}
