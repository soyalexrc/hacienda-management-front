import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {UpdateConsultantPayload, UpdateConsultantResult} from "../interfaces/consultant";

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  updateConsultant(payload: UpdateConsultantPayload): Observable<UpdateConsultantResult> {
    return this.http.post<UpdateConsultantResult>(`${this.baseUrl}/Users/updateAssetInfo`, payload);
  }
}
