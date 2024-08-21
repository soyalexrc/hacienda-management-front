import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getCurrentUser;
  if (user.mainUser.roleID !== 1) {
    router.navigate(['/'], { replaceUrl: true })
    return false
  }

  return true;
};
