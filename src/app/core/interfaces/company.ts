import {FormControl} from "@angular/forms";

export interface CompanyForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  companyData: FormControl<string | null>;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  companyData: string;
}
