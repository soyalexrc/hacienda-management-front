import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {
  BrandsResult,
  DevicesResult,
  ModelsResult,
  UpdateCreateDevicePayload,
  UpdateCreateDeviceResult
} from "../interfaces/device";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;
  getDevices(assetId = 0): Observable<DevicesResult> {
    return this.http.get<DevicesResult>(`${this.baseUrl}/Users/GetDevices`, {
      headers: {
        assetid: assetId.toString()
      }
    });
  }

  manageDevices(payload: UpdateCreateDevicePayload): Observable<UpdateCreateDeviceResult> {
    return this.http.post<UpdateCreateDeviceResult>(`${this.baseUrl}/Users/updateDeviceInfo`, payload);
  }

  getBrands(): Observable<BrandsResult> {
    return this.http.get<BrandsResult>(`${this.baseUrl}/Users/GetMake`);
  }

  getModels(brand: string): Observable<ModelsResult> {
    return this.http.get<ModelsResult>(`${this.baseUrl}/Users/GetModel?make=${brand}`);
  }

}
