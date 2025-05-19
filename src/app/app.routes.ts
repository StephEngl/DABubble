import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.guard';
import { MainContentComponent } from './main-content/main-content.component';
import { LegalNoticeComponent } from './login/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './login/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', component: MainContentComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
