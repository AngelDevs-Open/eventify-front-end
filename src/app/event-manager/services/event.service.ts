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
  private apiUrl = `${environment.serverBaseUrl}/social-events`;

  constructor() {
    super();
    this.resourceEndpoint = '/social-events';
    console.log('Events API URL:', this.apiUrl);
  }

  // Método para crear eventos directamente
  createEventDirect(event: EventEntity): Observable<EventEntity> {
    const http = new HttpClient(this.http['handler']);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Mapear del frontend al formato que espera el backend
    const eventData = {
      title: event.title,
      date: event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date,
      customerName: event.customerName,
      place: event.place,
      status: this.mapFrontendStatusToBackend(event.status.toString())
    };

    console.log('Creating event at URL:', this.apiUrl);
    console.log('Event data to send:', eventData);

    return http.post<any>(this.apiUrl, eventData, { headers }).pipe(
      tap(response => console.log('Create event response:', response)),
      map(response => this.mapBackendResponseToEntity(response)),
      catchError(this.handleDirectError)
    );
  }

  // Mapear respuesta del backend a EventEntity
  // Simplifica el mapeo - ya no necesitas mapBackendStatusToFrontend
  private mapBackendResponseToEntity(response: any): EventEntity {
    console.log('Mapping backend response:', response);

    const eventData: Event = {
      id: response.id ? response.id.toString() : '',
      title: response.title || '',
      date: response.date || new Date(),
      customerName: response.customerName || '',
      place: response.place || '',
      status: response.eventStatus || 'Active', // Usar directamente
      userId: 'current-user'
    };

    console.log('Mapped event data:', eventData);
    return new EventEntity(eventData);
  }



  // Mapear estados del frontend al backend
  private mapFrontendStatusToBackend(frontendStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'TO_BE_CONFIRMED': 'TO_CONFIRM',
      'ACTIVE': 'ACTIVE',
      'CANCELED': 'CANCELLED',
      'COMPLETED': 'COMPLETED'
    };
    return statusMap[frontendStatus] || frontendStatus;
  }

  // Mapear estados del backend al frontend
  private mapBackendStatusToFrontend(backendStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'TO_CONFIRM': 'TO_BE_CONFIRMED',
      'ACTIVE': 'ACTIVE',
      'CANCELLED': 'CANCELED',
      'COMPLETED': 'COMPLETED'
    };
    return statusMap[backendStatus] || backendStatus;
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
          event.place.toLowerCase().includes(query.toLowerCase())
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

  // Métodos del BaseService adaptados
  override getAll(): Observable<Event[]> {
    console.log('Getting all events from:', this.apiUrl);
    return super.getAll();
  }

  getAllAsEntities(): Observable<EventEntity[]> {
    return this.getAll().pipe(
      map(events => {
        console.log('Raw events from API:', events);
        return events.map(event => this.mapBackendResponseToEntity(event));
      }),
      tap(entities => console.log('Mapped entities:', entities)),
      catchError(error => {
        console.error('Error getting all events:', error);
        return throwError(() => error);
      })
    );
  }

  override getById(id: string): Observable<Event> {
    return super.getById(id);
  }

  getByIdAsEntity(id: string): Observable<EventEntity> {
    return this.getById(id).pipe(
      map(event => this.mapBackendResponseToEntity(event))
    );
  }

  override create(event: Event): Observable<Event> {
    console.log('Using BaseService create with data:', event);
    return super.create(event);
  }

  createEntity(event: EventEntity): Observable<EventEntity> {
    console.log('Creating entity with data:', event);
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
