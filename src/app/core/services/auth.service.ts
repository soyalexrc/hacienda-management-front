import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LoginResult} from "../interfaces/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: BehaviorSubject<LoginResult | {}> = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser') ?? '{}'));
  constructor() { }

  isAuthenticated(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    return !!isLoggedIn; // Convert to boolean (truthy/falsy check)
  }

  signIn(currentUser: LoginResult): void {
    sessionStorage.setItem('isLoggedIn', String(true));
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUser.next(currentUser);
  }

  signOff() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
  }
}
