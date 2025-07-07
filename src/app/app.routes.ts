import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {CalendarViewComponent} from './event-manager/pages/calendar-view/calendar-view.component';
import { EventManagementComponent } from './event-manager/pages/event-management/event-management.component';


const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path: 'calendar', component: CalendarViewComponent, data:{title: `${baseTitle} | Calendar`}},
  {path: 'social-events', component: EventManagementComponent, data: {title: `${baseTitle} | SocialEvents`} },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
