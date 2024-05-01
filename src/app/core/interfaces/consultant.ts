import {FormControl} from "@angular/forms";

export interface Consultant {
  id: string;
  name: string;
  address: string;
  phone: string;
  company: string;
  email: string;
}

export interface ConsultantForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  phone: FormControl<string | null>;
  company: FormControl<string | null>;
  email: FormControl<string | null>;
}
