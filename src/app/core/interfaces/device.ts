import {FormControl} from "@angular/forms";

export interface Device {
  id: string;
  brand: string;
  model: string;
  series: string;
  color: string;
  registerDate: string;
  deviceType: string;
}

export interface DeviceForm {
  brand: FormControl<string | null>;
  model: FormControl<string | null>;
  series: FormControl<string | null>;
  color: FormControl<string | null>;
  registerDate: FormControl<string | null>;
  deviceType: FormControl<string | null>;
}
