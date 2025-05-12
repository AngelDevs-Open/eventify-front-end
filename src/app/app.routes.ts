import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';

const baseTitle= 'Eventify'

export const routes: Routes = [
  {path: 'home', component: HomeComponent, data:{title: `${baseTitle} | Home`}},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
