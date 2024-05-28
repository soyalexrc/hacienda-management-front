import { Routes } from '@angular/router';
import {RootLayoutComponent} from "./core/layout/root-layout/root-layout.component";
import {authGuard} from "./core/guards/auth.guard";
import {consultantGuard} from "./core/guards/consultant.guard";
import {adminGuard} from "./core/guards/admin.guard";
import {deviceGuard} from "./core/guards/device.guard";

export const routes: Routes = [
  {
    path: '',
    component: RootLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./features/index-page/index-page.component').then(c => c.IndexPageComponent)
      },
      {
        path: 'companies',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./features/companies/companies.component').then(c => c.CompaniesComponent)
      },
      {
        path: 'consultants',
        canActivate: [authGuard, consultantGuard ],
        loadComponent: () => import('./features/consultants/consultants.component').then(c => c.ConsultantsComponent)
      },
      {
        path: 'devices',
        canActivate: [authGuard],
        loadComponent: () => import('./features/devices/devices.component').then(c => c.DevicesComponent)
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () => import('./features/notifications/notifications.component').then(c => c.NotificationsComponent)
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./features/auth/sign-in/sign-in.component').then(c => c.SignInComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./features/auth/sign-up/sign-up.component').then(c => c.SignUpComponent)
      },
    ]
  },
  {
    path: "**",
    pathMatch: 'full',
    redirectTo: ''
  },
];
