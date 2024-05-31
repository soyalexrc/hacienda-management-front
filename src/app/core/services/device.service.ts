import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DevicesResult, UpdateCreateDevicePayload, UpdateCreateDeviceResult} from "../interfaces/device";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;
  getDevices(): Observable<DevicesResult> {
    return this.http.get<DevicesResult>(`${this.baseUrl}/Users/GetDevices`);
  }

  manageDevices(payload: UpdateCreateDevicePayload): Observable<UpdateCreateDeviceResult> {
    return this.http.post<UpdateCreateDeviceResult>(`${this.baseUrl}/Users/updateDevInfo`, payload);
  }

}
