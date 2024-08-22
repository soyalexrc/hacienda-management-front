import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const deviceGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getCurrentUser;

  if (user.mainUser.roleID === 3 || user.mainUser.roleID === 2 || user.mainUser.roleID === 1 || user.mainUser.roleID === 0) {
    router.navigate(['/'], { replaceUrl: true })
    return false
  }
  return true;
};
