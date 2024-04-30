import { Routes } from '@angular/router';
import {RootLayoutComponent} from "./core/layout/root-layout/root-layout.component";
import {AuthLayoutComponent} from "./core/layout/auth-layout/auth-layout.component";
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: RootLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/index-page/index-page.component').then(c => c.IndexPageComponent)
      },
      {
        path: 'companies',
        loadComponent: () => import('./features/companies/companies.component').then(c => c.CompaniesComponent)
      },
      {
        path: 'consultants',
        loadComponent: () => import('./features/consultants/consultants.component').then(c => c.ConsultantsComponent)
      },
      {
        path: 'devices',
        loadComponent: () => import('./features/devices/devices.component').then(c => c.DevicesComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(c => c.NotificationsComponent)
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in'
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./features/auth/sign-in/sign-in.component').then(c => c.SignInComponent)
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
