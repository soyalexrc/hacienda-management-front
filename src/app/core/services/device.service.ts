import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
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
  assetIdFilter: BehaviorSubject<number> = new BehaviorSubject<number>(sessionStorage.getItem('assetIdFilter') ? Number(sessionStorage.getItem('assetIdFilter')) : 0);

  baseUrl = environment.baseUrl;
  getDevices(): Observable<DevicesResult> {
    console.log(this.assetIdFilter.value);
    return this.http.get<DevicesResult>(`${this.baseUrl}/Users/GetDevices`, {
      headers: {
        'assetId': `${this.assetIdFilter.value}`
      }
    });
  }

  manageDevices(payload: UpdateCreateDevicePayload): Observable<UpdateCreateDeviceResult> {
    return this.http.post<UpdateCreateDeviceResult>(`${this.baseUrl}/Users/updateDeviceInfo`, payload);
  }

  getColors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/Users/GetColors`);
  }

  getDeviceTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/Users/GetDeviceType`);
  }

  getBrands(): Observable<BrandsResult> {
    return this.http.get<BrandsResult>(`${this.baseUrl}/Users/GetMake`);
  }

  getModels(brand: string): Observable<ModelsResult> {
    return this.http.get<ModelsResult>(`${this.baseUrl}/Users/GetModel?make=${brand}`);
  }

  updateAssetIdFilter(value: number) {
    sessionStorage.setItem('assetIdFilter', value.toString());
    this.assetIdFilter.next(value);
  }

}
