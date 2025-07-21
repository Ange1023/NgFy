import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { LoginGuard } from './guards/no-auth-guard.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/auth/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/auth/sign-in/sign-in.page').then( m => m.SignInPage),
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  }
];
