import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, EventEntity } from '../model/event.entity';
import { BaseService } from '../../shared/services/base.service';
import { EventStatusEnum } from '../model/event-status.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService<Event> {
  private apiUrl = `${environment.serverBaseUrl}/events`;

  constructor() {
    super();
    this.resourceEndpoint = '/events';
    console.log('Events API URL:', this.resourcePath());
  }

  // Método mejorado para crear eventos directamente, evitando problemas con BaseService
  createEventDirect(event: EventEntity): Observable<EventEntity> {
    const http = new HttpClient(this.http['handler']);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Crear un objeto limpio para enviar al servidor
    const eventData = {
      id: event.id,
      title: event.title,
      date: event.date instanceof Date ? event.date.toISOString() : event.date,
      customerName: event.customerName,
      location: event.location,
      status: typeof event.status === 'string' ? event.status : event.status.toString(),
      userId: event.userId
    };

    console.log('Creating event directly at URL:', this.apiUrl);
    console.log('Event data to send:', eventData);

    return http.post<Event>(this.apiUrl, eventData, { headers }).pipe(
      tap(response => console.log('Create event response:', response)),
      map(response => new EventEntity(response)),
      catchError(this.handleDirectError)
    );
  }

  private handleDirectError(error: HttpErrorResponse) {
    console.error('API Error details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
      message: error.message
    });

    return throwError(() => new Error(`Error in API call: ${error.message}`));
  }

  // Métodos específicos para eventos
  getEventsByStatus(status: EventStatusEnum): Observable<EventEntity[]> {
    return this.getAllAsEntities().pipe(
      map(events => events.filter(event => event.status.value === status))
    );
  }

  searchEvents(query: string): Observable<EventEntity[]> {
    return this.getAllAsEntities().pipe(
      map(events => events
        .filter(event =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.customerName.toLowerCase().includes(query.toLowerCase()) ||
          event.location.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  getRecentEvents(limit: number = 5): Observable<EventEntity[]> {
    return this.getAllAsEntities().pipe(
      map(events => events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
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
    console.log('Using BaseService create with data:', event);
    return super.create(event);
  }

  createEntity(event: EventEntity): Observable<EventEntity> {
    console.log('Creating entity with data:', event);
    // Usar el método directo en lugar del BaseService
    return this.createEventDirect(event);
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
