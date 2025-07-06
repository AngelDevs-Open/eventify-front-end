import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {CalendarViewComponent} from './events/pages/calendar-view/calendar-view.component';

const QuoteManagementComponent = ()=> import('./planning/pages/quote-order-management/quote-order-management.component').then(m => m.QuoteOrderManagementComponent);
const QuoteOrderCreateAndEditComponent= ()=> import('./planning/components/quote-order-create-and-edit/quote-order-create-and-edit.component').then(m => m.QuoteOrderCreateAndEditComponent);

const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path:'quotes', loadComponent: QuoteManagementComponent, data:{title: `${baseTitle} | Quotes`}},
  {path:'quotes/new',loadComponent:QuoteOrderCreateAndEditComponent, data:{title: `${baseTitle} | Quotes`,editMode:false}},
  {path:'quotes/:quoteId/edit',loadComponent:QuoteOrderCreateAndEditComponent, data:{title: `${baseTitle} | Quotes`,editMode:true}},
  {path: 'calendar', component: CalendarViewComponent, data:{title: `${baseTitle} | Calendar`}},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
