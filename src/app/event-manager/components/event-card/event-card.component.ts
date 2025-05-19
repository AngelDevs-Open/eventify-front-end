import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EventEntity } from '../../model/event.entity';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event!: EventEntity;
  @Output() edit = new EventEmitter<EventEntity>();
  @Output() delete = new EventEmitter<EventEntity>();

  onEdit(): void {
    this.edit.emit(this.event);
  }

  onDelete(): void {
    this.delete.emit(this.event);
  }
}
