import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.guard';
import { MainContentComponent } from './main-content/main-content.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
    // { path: '', component: MainContentComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    {
        path: 'login',
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: '',
        loadComponent: () =>
            import('./main-content/main-content.component').then(
            (m) => m.MainContentComponent
            ),
        canActivate: [AuthGuard],
    },
    // {
    //     path: '',
    //     redirectTo: 'login',
    //     pathMatch: 'full',
    // },
];
