import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: NotFound },
  { path: '**', component: NotFound },
];
