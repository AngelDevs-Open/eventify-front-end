import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { EventEntity } from '../model/event.entity';
import { EventStatus, EventStatusEnum } from '../model/event-status.entity';
import { environment } from '../../../environments/environment';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all events', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Event 1',
        date: '2025-06-15T10:00:00.000Z',
        customerName: 'Customer 1',
        location: 'Location 1',
        status: 'Active',
        userId: 'user1'
      },
      {
        id: '2',
        title: 'Event 2',
        date: '2025-07-20T14:00:00.000Z',
        customerName: 'Customer 2',
        location: 'Location 2',
        status: 'To be confirmed',
        userId: 'user1'
      }
    ];

    service.getAll().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events[0].id).toBe('1');
    });

    const req = httpMock.expectOne(`${environment.serverBaseUrl}/events`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should retrieve all events as entities', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Event 1',
        date: '2025-06-15T10:00:00.000Z',
        customerName: 'Customer 1',
        location: 'Location 1',
        status: 'Active',
        userId: 'user1'
      }
    ];

    service.getAllAsEntities().subscribe(events => {
      expect(events.length).toBe(1);
      expect(events[0] instanceof EventEntity).toBeTrue();
      expect(events[0].status.value).toBe(EventStatusEnum.ACTIVE);
    });

    const req = httpMock.expectOne(`${environment.serverBaseUrl}/events`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should create an event', () => {
    const mockEvent = new EventEntity({
      id: '1',
      title: 'New Event',
      date: new Date('2025-10-10'),
      customerName: 'Customer',
      location: 'Location',
      status: new EventStatus(EventStatusEnum.TO_BE_CONFIRMED),
      userId: 'user1'
    });

    service.createEntity(mockEvent).subscribe(event => {
      expect(event instanceof EventEntity).toBeTrue();
      expect(event.id).toBe('1');
      expect(event.title).toBe('New Event');
    });

    const req = httpMock.expectOne(`${environment.serverBaseUrl}/events`);
    expect(req.request.method).toBe('POST');
    req.flush(mockEvent.toJSON());
  });

  it('should filter events by status', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Event 1',
        date: '2025-06-15T10:00:00.000Z',
        customerName: 'Customer 1',
        location: 'Location 1',
        status: 'Active',
        userId: 'user1'
      },
      {
        id: '2',
        title: 'Event 2',
        date: '2025-07-20T14:00:00.000Z',
        customerName: 'Customer 2',
        location: 'Location 2',
        status: 'To be confirmed',
        userId: 'user1'
      }
    ];

    service.getEventsByStatus(EventStatusEnum.ACTIVE).subscribe(events => {
      expect(events.length).toBe(1);
      expect(events[0].status.value).toBe(EventStatusEnum.ACTIVE);
    });

    const req = httpMock.expectOne(`${environment.serverBaseUrl}/events`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });
});
