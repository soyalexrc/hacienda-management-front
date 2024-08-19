import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import { heroBellSolid, heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import {NotificationService} from "../../services/notification.service";
import {NotesInfo, NotificationsResult} from "../../interfaces/notification";
import {Subscription} from "rxjs";
import {ToastContainerComponent} from "../../../shared/components/toast-container/toast-container.component";

@Component({
  selector: 'app-root-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NgIconComponent,
    RouterLink,
    ToastContainerComponent
  ],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss',
  viewProviders: [provideIcons({ heroBellSolid, heroUserCircleSolid })]
})
export class RootLayoutComponent implements OnInit, OnDestroy{
  private router = inject(Router);
  private auth = inject(AuthService);
  private notificationsService = inject(NotificationService);
  notificationsAmount = 0;
  notificationsSubscription = new Subscription();

  ngOnInit() {
    this.notificationsSubscription = this.notificationsService.notifications.subscribe(result => {
      this.notificationsAmount = result.length;
    });
  }

  ngOnDestroy() {
    this.notificationsSubscription.unsubscribe();
  }

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
