import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CompaniesResult} from "../interfaces/company";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;
  getCompanies(): Observable<CompaniesResult> {
    return this.http.get<CompaniesResult>(`${this.baseUrl}/Users/GetCompany`);
  }
}
