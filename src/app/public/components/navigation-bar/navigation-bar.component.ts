import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    MatToolbar,
    LanguageSwitcherComponent,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {
  options=[
    {link: '/home',label:'toolbar.home'},
    {link:'/profile',label:'toolbar.profile'},
    {link: '/calendar',label:'toolbar.calendar'},
    {link:'/events',label:'toolbar.events'},
    {link:'/tasks',label:'toolbar.tasks'},
    {link:'/quotes',label:'toolbar.quotes'},
    {link:'/messages',label:'toolbar.messages'},
    {link:'/subscriptions',label:'toolbar.subscriptions'},
  ]
}
