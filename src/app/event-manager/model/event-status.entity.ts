export enum EventStatusEnum {
  ACTIVE = 'Active',
  TO_BE_CONFIRMED = 'To be confirmed',
  CANCELED = 'Canceled'
}

export class EventStatus {
  value: EventStatusEnum;

  constructor(status: EventStatusEnum) {
    this.value = status;
  }

  getColor(): string {
    switch(this.value) {
      case EventStatusEnum.ACTIVE:
        return '#4CAF50';
      case EventStatusEnum.TO_BE_CONFIRMED:
        return '#FFC107';
      case EventStatusEnum.CANCELED:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }

  getBackgroundColor(): string {
    switch(this.value) {
      case EventStatusEnum.ACTIVE:
        return 'rgba(76, 175, 80, 0.1)';
      case EventStatusEnum.TO_BE_CONFIRMED:
        return 'rgba(255, 193, 7, 0.1)';
      case EventStatusEnum.CANCELED:
        return 'rgba(244, 67, 54, 0.1)';
      default:
        return 'rgba(158, 158, 158, 0.1)';
    }
  }

  toString(): string {
    return this.value;
  }

  static fromString(value: string): EventStatus {
    switch(value) {
      case EventStatusEnum.ACTIVE:
        return new EventStatus(EventStatusEnum.ACTIVE);
      case EventStatusEnum.TO_BE_CONFIRMED:
        return new EventStatus(EventStatusEnum.TO_BE_CONFIRMED);
      case EventStatusEnum.CANCELED:
        return new EventStatus(EventStatusEnum.CANCELED);
      default:
        throw new Error(`Invalid event status: ${value}`);
    }
  }
}
