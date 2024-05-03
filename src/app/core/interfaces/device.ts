import {FormControl} from "@angular/forms";

export interface Device {
  id: string | number;
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

export interface DevicesResult {
  deviceInfo:   DeviceInfo[];
  hasError:     boolean;
  errorDisplay: string;
  errorDesc:    string;
  errorNum:     number;
  errorSubject: string;
  message:      string;
}

export interface DeviceInfo {
  propid:               number;
  propassetid:          number;
  propregistrationdate: string;
  propactive:           boolean;
  propmake:             string;
  propmodel:            string;
  propcolor:            string;
  propserial:           string;
  propapprovalStatus:   string;
  propapprovalperson:   string;
  propcheckStatus:      boolean;
  propcheckoutDate:     string;
  propcheckinDate:      string;
  propupdatedby:        string;
  proplastupdate:       string;
}
