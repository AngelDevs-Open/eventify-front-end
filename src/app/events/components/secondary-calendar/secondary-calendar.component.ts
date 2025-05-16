import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-secondary-calendar',
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule],
  templateUrl: './secondary-calendar.component.html',
  styleUrl: './secondary-calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryCalendarComponent {
  selected = model<Date | null>(null);
}
