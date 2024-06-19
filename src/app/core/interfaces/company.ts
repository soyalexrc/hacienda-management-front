import {FormControl} from "@angular/forms";

export interface CompanyForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  companyData: FormControl<string | null>;
}

export interface Company {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  email: string;
  companyData: string;
}

export interface CompaniesResult {
  companyInfo:  CompanyInfo[];
  hasError:     boolean;
  errorDisplay: string;
  errorDesc:    string;
  errorNum:     number;
  errorSubject: string;
  message:      string;
}

export interface CompanyInfo {
  company_id:           number;
  company_name:         string;
  company_officer_id:   number;
  company_add1:         string;
  company_add2:         string;
  company_city:         string;
  company_zip:          string;
  company_phone:        string;
  company_status:       boolean;
  company_creationdate: string;
  company_lastupdate:   string;
  company_updateby:     string;
  company_deleted_date: string;
}


export interface UpdateCompanyResult {

}


export interface UpdateCompanyPayload {
    company_id: string,
    company_name: string,
    company_add1: string,
    company_add2: string,
    company_city: string,
    company_zip: string,
    company_phone: string,
    company_status: true,
    company_updateby: string,
    company_officer_id: 0
}
