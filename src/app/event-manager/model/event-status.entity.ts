export enum EventStatusEnum {
  ACTIVE = 'Active',
  TO_BE_CONFIRMED = 'To be confirmed',
  CANCELED = 'Canceled',
  COMPLETED = 'Completed'
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
      case EventStatusEnum.COMPLETED:
        return '#2196F3';
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
      case EventStatusEnum.COMPLETED:
        return 'rgba(33, 150, 243, 0.1)';
      default:
        return 'rgba(158, 158, 158, 0.1)';
    }
  }

  toString(): string {
    return this.value;
  }

  static fromString(value: string): EventStatus {
    // Crear un mapa para hacer la conversión más clara
    const statusMap: { [key: string]: EventStatusEnum } = {
      'Active': EventStatusEnum.ACTIVE,
      'To be confirmed': EventStatusEnum.TO_BE_CONFIRMED,
      'Canceled': EventStatusEnum.CANCELED,
      'Completed': EventStatusEnum.COMPLETED,
      // Mapeos adicionales para backend
      'ACTIVE': EventStatusEnum.ACTIVE,
      'TO_CONFIRM': EventStatusEnum.TO_BE_CONFIRMED,
      'CANCELLED': EventStatusEnum.CANCELED,
      'COMPLETED': EventStatusEnum.COMPLETED,
      'Pending': EventStatusEnum.TO_BE_CONFIRMED
    };

    const mappedStatus = statusMap[value];
    if (mappedStatus) {
      return new EventStatus(mappedStatus);
    }

    throw new Error(`Invalid event status: ${value}`);
  }
}
