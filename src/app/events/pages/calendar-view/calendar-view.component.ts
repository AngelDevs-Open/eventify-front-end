import { Component } from '@angular/core';
import {MainCalendarComponent} from '../../components/main-calendar/main-calendar.component';
import {SecondaryCalendarComponent} from '../../components/secondary-calendar/secondary-calendar.component';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    MainCalendarComponent,
    SecondaryCalendarComponent
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent {
  title = 'Calendar View';
}
