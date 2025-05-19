import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, EventEntity } from '../model/event.entity';
import { BaseService } from '../../shared/services/base.service';
import { EventStatusEnum } from '../model/event-status.entity';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService<Event> {
  constructor(protected override http: HttpClient) {
    super(); //
  }

  // Métodos específicos para eventos
  getEventsByStatus(status: EventStatusEnum): Observable<EventEntity[]> {
    return this.getAll().pipe(
      map(events => events
        .filter(event => event.status === status)
        .map(event => new EventEntity(event))
      )
    );
  }

  searchEvents(query: string): Observable<EventEntity[]> {
    return this.getAll().pipe(
      map(events => events
        .filter(event =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.customerName.toLowerCase().includes(query.toLowerCase()) ||
          event.location.toLowerCase().includes(query.toLowerCase())
        )
        .map(event => new EventEntity(event))
      )
    );
  }

  getRecentEvents(limit: number = 5): Observable<EventEntity[]> {
    return this.getAll().pipe(
      map(events => events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
        .map(event => new EventEntity(event))
      )
    );
  }

  // Envolvemos los métodos del BaseService para transformar de/a EventEntity
  override getAll(): Observable<Event[]> {
    return super.getAll();
  }

  getAllAsEntities(): Observable<EventEntity[]> {
    return this.getAll().pipe(
      map(events => events.map(event => new EventEntity(event)))
    );
  }

  override getById(id: string): Observable<Event> {
    return super.getById(id);
  }

  getByIdAsEntity(id: string): Observable<EventEntity> {
    return this.getById(id).pipe(
      map(event => new EventEntity(event))
    );
  }

  override create(event: Event): Observable<Event> {
    return super.create(event);
  }

  createEntity(event: EventEntity): Observable<EventEntity> {
    return this.create(event.toJSON()).pipe(
      map(createdEvent => new EventEntity(createdEvent))
    );
  }

  override update(id: string, event: Event): Observable<Event> {
    return super.update(id, event);
  }

  updateEntity(event: EventEntity): Observable<EventEntity> {
    return this.update(event.id, event.toJSON()).pipe(
      map(updatedEvent => new EventEntity(updatedEvent))
    );
  }

  override delete(id: string): Observable<void> {
    return super.delete(id);
  }
}
