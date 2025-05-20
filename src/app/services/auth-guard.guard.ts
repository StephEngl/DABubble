import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject (Router);

    if (authService.isLoggedIn()) {
        return true;
    } else {
        return router.createUrlTree(['/login']);
    }
};