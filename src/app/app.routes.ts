import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Angular Refresher · Home',
  },
  {
    path: 'feature/:slug',
    loadComponent: () =>
      import('./shared/feature-page/feature-page').then((m) => m.FeaturePage),
    title: 'Angular Refresher · Feature',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Angular Refresher · Not found',
  },
];
