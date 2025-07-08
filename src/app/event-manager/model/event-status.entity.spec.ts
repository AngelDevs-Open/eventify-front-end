import { EventStatus, EventStatusEnum } from './event-status.entity';

describe('EventStatus', () => {
  it('should create an instance', () => {
    expect(new EventStatus(EventStatusEnum.ACTIVE)).toBeTruthy();
  });

  it('should return the correct color for ACTIVE status', () => {
    const status = new EventStatus(EventStatusEnum.ACTIVE);
    expect(status.getColor()).toBe('#4CAF50');
  });

  it('should return the correct color for TO_BE_CONFIRMED status', () => {
    const status = new EventStatus(EventStatusEnum.TO_BE_CONFIRMED);
    expect(status.getColor()).toBe('#FFC107');
  });

  it('should return the correct color for CANCELED status', () => {
    const status = new EventStatus(EventStatusEnum.CANCELED);
    expect(status.getColor()).toBe('#F44336');
  });

  it('should convert to string correctly', () => {
    const status = new EventStatus(EventStatusEnum.ACTIVE);
    expect(status.toString()).toBe('Active');
  });

  it('should create from string correctly', () => {
    const status = EventStatus.fromString('Active');
    expect(status.value).toBe(EventStatusEnum.ACTIVE);
  });

  it('should throw error for invalid status string', () => {
    expect(() => EventStatus.fromString('Invalid')).toThrowError('Invalid event status: Invalid');
  });
});
