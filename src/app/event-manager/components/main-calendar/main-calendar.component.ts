import {Component, OnInit, signal} from '@angular/core';
import {CalendarOptions, EventClickArg} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {EventService} from '../../services/event.service';
import {EventEntity} from '../../model/event.entity';
import {FullCalendarModule} from '@fullcalendar/angular';


@Component({
  selector: 'app-main-calendar',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './main-calendar.component.html',
  styleUrl: './main-calendar.component.css'
})
export class MainCalendarComponent implements OnInit {
  title= 'Main Calendar';
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    events:[],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    eventClick: this.handleEventClick.bind(this),
    selectable: true,

  };

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    console.log("iniciando calendario")
    this.eventService.getAllAsEntities().subscribe((events: EventEntity[]) =>{
      this.calendarOptions.events = events.map(e=> ({
        id: e.id,
        title: `${e.title} - ${e.customerName}`,
        start: e.date,
        extendedProps: {
          location: e.place,
          status: e.status,
        }
      }));
    });
    console.log(this.calendarOptions.events);
  }

  handleEventClick(clickInfo: EventClickArg) {
  }

}
