import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationBarComponent} from './public/components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eventify-front-end';
}
