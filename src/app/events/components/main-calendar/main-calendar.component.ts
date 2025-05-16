import { Component } from '@angular/core';
import { CalendarComponent} from '@schedule-x/angular';
import {createCalendar, createViewMonthAgenda, createViewMonthGrid, createViewWeek} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css'


@Component({
  selector: 'app-main-calendar',
  standalone: true,
  imports: [
    CalendarComponent
  ],
  templateUrl: './main-calendar.component.html',
  styleUrl: './main-calendar.component.css'
})
export class MainCalendarComponent {
  title= 'Main Calendar';
  calendarApp = createCalendar({
    events: [
      {
        id: 1,
        title: 'Coffee with John',
        start: '2025-05-04 10:05',
        end: '2025-05-04 10:35',
      },
      {
        id: 2,
        title: 'Ski trip',
        start: '2025-05-08',
        end: '2025-05-11',
      },
      {
        id: 3,
        title: 'Play videogames',
        start: '2025-05-09 10:00',
        end: '2025-05-09 13:00',
      },
      {
        id: 4,
        title: 'vacation',
        start: '2025-05-17',
        end: '2025-05-19',
      },
    ],
    views: [createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  })
}
