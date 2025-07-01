import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {ProfileManagementComponent} from './profileManagement/pages/profile-management/profile-management.component';

const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'profile', component: ProfileManagementComponent },
  { path: 'profile/:id', component: ProfileManagementComponent }
];
