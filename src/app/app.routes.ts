import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';

const QuoteManagementComponent = ()=> import('./quotes/pages/quote-order-management/quote-order-management.component').then(m => m.QuoteOrderManagementComponent);

const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path:'quotes', loadComponent: QuoteManagementComponent, data:{title: `${baseTitle} | Quotes`}},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
