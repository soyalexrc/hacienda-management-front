import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CompaniesResult, UpdateCompanyPayload, UpdateCompanyResult} from "../interfaces/company";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;
  getCompanies(companyId = 0): Observable<CompaniesResult> {
    return this.http.get<CompaniesResult>(`${this.baseUrl}/Users/GetCompany`, {
      headers: {
        companyid: companyId.toString()
      }
    });
  }

  updateCompany(payload: UpdateCompanyPayload): Observable<UpdateCompanyResult> {
    return this.http.post<UpdateCompanyResult>(`${this.baseUrl}/Users/updateCompany`, payload);
  }
}
