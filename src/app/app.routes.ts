import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home') },
  { path: 'projects', loadComponent: () => import('./pages/projects/songbook') },
  { path: 'projects/:slug', loadComponent: () => import('./pages/projects/case-study') },
  { path: 'about', loadComponent: () => import('./pages/about/about') },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog-list') },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog/blog-post') },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact') },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found') },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found') },
];
