import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const isAuthenticated = auth.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  router.navigate(['/sign-in'], { replaceUrl: true });
  return false;
};
