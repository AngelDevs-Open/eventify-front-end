import { EventStatus, EventStatusEnum } from './event-status.entity';

export interface Event {
  id: string;
  title: string;
  date: Date | string;
  customerName: string;
  location: string;
  status: EventStatus | string;
  userId: string;
}

export class EventEntity implements Event {
  id: string;
  title: string;
  date: Date;
  customerName: string;
  location: string;
  status: EventStatus;
  userId: string;

  constructor(event: Event) {
    this.id = event.id;
    this.title = event.title;
    this.date = event.date instanceof Date ? event.date : new Date(event.date);
    this.customerName = event.customerName;
    this.location = event.location;
    this.status = event.status instanceof EventStatus
      ? event.status
      : EventStatus.fromString(event.status as string);
    this.userId = event.userId;
  }

  isValid(): boolean {
    return Boolean(
      this.title &&
      this.date &&
      this.customerName &&
      this.location &&
      this.status
    );
  }

  canChangeStatusTo(newStatus: EventStatusEnum): boolean {
    // No se puede cambiar desde cancelado
    if (this.status.value === EventStatusEnum.CANCELED) {
      return false;
    }

    // Si ya está en ese estado, no cambiar
    if (this.status.value === newStatus) {
      return false;
    }

    return true;
  }

  changeStatus(newStatus: EventStatusEnum): boolean {
    if (this.canChangeStatusTo(newStatus)) {
      this.status = new EventStatus(newStatus);
      return true;
    }
    return false;
  }

  formattedDate(): string {
    return this.date.toLocaleDateString();
  }

  toJSON(): Event {
    return {
      id: this.id,
      title: this.title,
      date: this.date.toISOString(),
      customerName: this.customerName,
      location: this.location,
      status: this.status.toString(),
      userId: this.userId
    };
  }

  static createNew(
    title: string,
    date: Date,
    customerName: string,
    location: string,
    userId: string
  ): EventEntity {
    return new EventEntity({
      id: crypto.randomUUID(),
      title,
      date,
      customerName,
      location,
      status: new EventStatus(EventStatusEnum.TO_BE_CONFIRMED),
      userId
    });
  }
}
