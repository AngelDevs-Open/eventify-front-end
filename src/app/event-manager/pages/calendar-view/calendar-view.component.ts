import { Component } from '@angular/core';
import {MainCalendarComponent} from '../../components/main-calendar/main-calendar.component';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    MainCalendarComponent,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent {
  title = 'Calendar View';
}
