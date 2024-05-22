import {FormControl} from "@angular/forms";

export interface Consultant {
  id: string;
  name: string;
  address: string;
  address2?: string;
  state?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  phone: string;
  company: string;
  email: string;
}

export interface ConsultantForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  address2: FormControl<string | null>;
  zipCode: FormControl<string | null>;
  state: FormControl<string | null>;
  city: FormControl<string | null>;
  country: FormControl<string | null>;
  phone: FormControl<string | null>;
  company: FormControl<string | null>;
  email: FormControl<string | null>;
}
