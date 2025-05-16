import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {CalendarViewComponent} from './events/pages/calendar-view/calendar-view.component';

const QuoteManagementComponent = ()=> import('./quotes/pages/quote-order-management/quote-order-management.component').then(m => m.QuoteOrderManagementComponent);

const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path:'quotes', loadComponent: QuoteManagementComponent, data:{title: `${baseTitle} | Quotes`}},
  {path: 'calendar', component: CalendarViewComponent, data:{title: `${baseTitle} | Calendar`}},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
