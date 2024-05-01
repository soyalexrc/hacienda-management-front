import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-root-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf
  ],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss'
})
export class RootLayoutComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  get currentRoute(): string {
    return this.router.url;
  }

  hideSignOut(): boolean {
    const authRoutes = ['/sign-in', '/forgot-password', '/sign-up'];
    return authRoutes.some(route => route === this.currentRoute);
  }

  signOut() {
    this.auth.signOff();
    this.router.navigate(['/sign-in'], {replaceUrl: true})
  }
}
