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

    // Manejo mejorado de la fecha
    if (event.date instanceof Date) {
      this.date = event.date;
    } else {
      this.date = new Date(event.date);
    }

    this.customerName = event.customerName;
    this.location = event.location;

    // Manejo mejorado del estado
    if (event.status instanceof EventStatus) {
      this.status = event.status;
    } else {
      this.status = EventStatus.fromString(event.status as string);
    }

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

  toJSON(): any {
    // Asegurarnos de que la fecha esté en formato ISO 8601
    let dateValue: string;

    if (this.date instanceof Date) {
      dateValue = this.date.toISOString();
    } else if (typeof this.date === 'string') {
      try {
        const dateObj = new Date(this.date);
        dateValue = dateObj.toISOString();
      } catch (e) {
        console.error('Error converting date string to ISO format:', e);
        dateValue = String(this.date);
      }
    } else {
      dateValue = String(this.date);
    }

    console.log('Original date:', this.date);
    console.log('Formatted date for JSON:', dateValue);

    return {
      id: this.id,
      title: this.title,
      date: dateValue,
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
