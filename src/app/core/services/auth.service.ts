import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {LoginResult} from "../interfaces/auth";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<LoginResult | {}> = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser') ?? '{}'));
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;
  private router = inject(Router);
  isAuthenticated(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    return !!isLoggedIn; // Convert to boolean (truthy/falsy check)
  }

  signIn(email: string, password: string): Observable<LoginResult> {
    return this.http.get<LoginResult>(`${this.baseUrl}/Users/GetUser`, {
      headers: {
        asset_id: email,
        userpass: password
      }
    });
  }

  changePassword(userId: string, userPass: string): Observable<any> {
    return this.http.get(`/api/Users/GetPass`, {
      headers: {
        userid: userId,
        userpass: userPass
      }
    });
  }

  getOtp(userId: string): Observable<any> {
    return this.http.get(`/api/Users/GetOTP?assetid=${userId}`);
  }

  signOff() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    this.updateCurrentUser({})
  }

  updateCurrentUser(currentUser: LoginResult | {}) {
    this.currentUser.next(currentUser);
  }

  get getCurrentUser(): LoginResult {
    return this.currentUser.value as LoginResult;
  }
}
