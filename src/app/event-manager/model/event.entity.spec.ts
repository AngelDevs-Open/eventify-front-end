import { EventEntity } from './event.entity';
import { EventStatus, EventStatusEnum } from './event-status.entity';

describe('EventEntity', () => {
  let event: EventEntity;

  beforeEach(() => {
    event = new EventEntity({
      id: '1',
      title: 'Test Event',
      date: new Date('2025-12-31'),
      customerName: 'Test Customer',
      location: 'Test Location',
      status: new EventStatus(EventStatusEnum.ACTIVE),
      userId: 'user1'
    });
  });

  it('should create an instance', () => {
    expect(event).toBeTruthy();
  });

  it('should correctly format date', () => {
    expect(event.formattedDate()).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  it('should validate correctly', () => {
    expect(event.isValid()).toBeTrue();

    const invalidEvent = new EventEntity({
      id: '2',
      title: '',
      date: new Date(),
      customerName: 'Test Customer',
      location: 'Test Location',
      status: new EventStatus(EventStatusEnum.ACTIVE),
      userId: 'user1'
    });

    expect(invalidEvent.isValid()).toBeFalse();
  });

  it('should handle status changes correctly', () => {
    expect(event.canChangeStatusTo(EventStatusEnum.TO_BE_CONFIRMED)).toBeTrue();
    expect(event.canChangeStatusTo(EventStatusEnum.ACTIVE)).toBeFalse(); // Already active

    const canceledEvent = new EventEntity({
      id: '3',
      title: 'Canceled Event',
      date: new Date(),
      customerName: 'Test Customer',
      location: 'Test Location',
      status: new EventStatus(EventStatusEnum.CANCELED),
      userId: 'user1'
    });

    expect(canceledEvent.canChangeStatusTo(EventStatusEnum.ACTIVE)).toBeFalse();
  });

  it('should create new event with default TO_BE_CONFIRMED status', () => {
    const newEvent = EventEntity.createNew(
      'New Event',
      new Date(),
      'New Customer',
      'New Location',
      'user1'
    );

    expect(newEvent.status.value).toBe(EventStatusEnum.TO_BE_CONFIRMED);
    expect(newEvent.id).toBeDefined();
  });

  it('should serialize to JSON correctly', () => {
    const json = event.toJSON();
    expect(json.status).toBe('Active');
    expect(json.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/); // ISO date format
  });
});
