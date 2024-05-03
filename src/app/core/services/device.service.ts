import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DevicesResult} from "../interfaces/device";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;
  getDevices(): Observable<DevicesResult> {
    return this.http.get<DevicesResult>(`${this.baseUrl}/Users/GetDevices`);
  }

}
