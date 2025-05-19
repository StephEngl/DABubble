import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

/**
 * Route guard that checks if the user is authenticated.
 *
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns `true` if the user is logged in, otherwise a UrlTree redirecting to the login page.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject (Router);

    if (authService.isLoggedIn()) {
        return true;
    } else {
        return router.createUrlTree(['/login']);
    }
};