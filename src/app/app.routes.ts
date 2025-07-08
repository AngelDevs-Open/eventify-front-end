import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {ProfileManagementComponent} from './profileManagement/pages/profile-management/profile-management.component';

import {authenticationGuard} from './iam/services/authentication.guard';
import {SignInComponent} from './iam/pages/sign-in/sign-in.component';
import {SignUpComponent} from './iam/pages/sign-up/sign-up.component';

const QuoteManagementComponent = ()=> import('./planning/pages/quote-order-management/quote-order-management.component').then(m => m.QuoteOrderManagementComponent);
const QuoteOrderCreateAndEditComponent= ()=> import('./planning/components/quote-order-create-and-edit/quote-order-create-and-edit.component').then(m => m.QuoteOrderCreateAndEditComponent);
import {CalendarViewComponent} from './event-manager/pages/calendar-view/calendar-view.component';
import { EventManagementComponent } from './event-manager/pages/event-management/event-management.component';


const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path:'quotes', loadComponent: QuoteManagementComponent, data:{title: `${baseTitle} | Quotes`}, canActivate:[authenticationGuard]},
  {path:'quotes/new',loadComponent:QuoteOrderCreateAndEditComponent, data:{title: `${baseTitle} | Quotes`,editMode:false}, canActivate:[authenticationGuard]},
  {path:'quotes/:quoteId/edit',loadComponent:QuoteOrderCreateAndEditComponent, data:{title: `${baseTitle} | Quotes`,editMode:true}, canActivate:[authenticationGuard]},
  { path: 'sign-in',          component:      SignInComponent,              data: { title: `${baseTitle} | Sign-in`} },
  { path: 'sign-up',          component:      SignUpComponent,              data: { title: `${baseTitle} | Sign-up`} },
  {path: 'calendar', component: CalendarViewComponent, data:{title: `${baseTitle} | Calendar`}, canActivate:[authenticationGuard]},
  {path: 'social-events', component: EventManagementComponent, data: {title: `${baseTitle} | SocialEvents`}, canActivate:[authenticationGuard]  },
  { path: 'profile', component: ProfileManagementComponent, canActivate:[authenticationGuard] },
  { path: 'profile/:id', component: ProfileManagementComponent, canActivate:[authenticationGuard] },
  {path: '', redirectTo: '/home', pathMatch: 'full'},

];
