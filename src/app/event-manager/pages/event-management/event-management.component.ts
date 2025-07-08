import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventCreateAndEditComponent } from '../../components/event-create-and-edit/event-create-and-edit.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { EventFiltersComponent, EventFilters } from '../../components/event-filters/event-filters.component';
import { EventEntity } from '../../model/event.entity';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule,
    EventCardComponent,
    EventFiltersComponent
  ],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: EventEntity[] = [];
  filteredEvents: EventEntity[] = [];
  searchText: string = '';
  selectedFilter: string = 'all';

  currentPage: number = 1;
  pageSize: number = 6;
  hasMorePages: boolean = false;

  loading: boolean = true;
  showAdvancedFilters: boolean = false;

  // Mock user ID - In a real app, get from auth service
  userId: string = 'current-user-id';

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllAsEntities().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = [...this.events];
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showNotification('ERRORS.LOADING_EVENTS', 'error');
        console.error('Error loading events:', error);
      }
    });
  }

  applyEventFilters(filters: EventFilters): void {
    this.searchText = filters.searchText;
    this.selectedFilter = filters.filterType;

    // Primero aplicar búsqueda por texto
    let result = this.events;

    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(search) ||
        event.customerName.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search)
      );
    }

    // Aplicar filtro por estado si está seleccionado
    if (filters.statusFilter) {
      result = result.filter(event =>
        event.status.value === filters.statusFilter
      );
    }

    // Aplicar filtro de fecha desde
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(event => event.date >= fromDate);
    }

    // Aplicar filtro de fecha hasta
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(event => event.date <= toDate);
    }

    // Aplicar orden según el tipo de filtro seleccionado
    switch (filters.filterType) {
      case 'recent':
        result = [...result].sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        result = [...result].sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'alphabetical':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // No aplicar ordenamiento adicional
        break;
    }

    this.filteredEvents = result;
    this.currentPage = 1; // Reiniciar a la primera página cuando cambian los filtros
    this.updatePagination();
  }

  toggleAdvancedFilters(show: boolean): void {
    this.showAdvancedFilters = show;
  }

  get paginatedEvents(): EventEntity[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEvents.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.hasMorePages) {
      this.currentPage++;
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    this.hasMorePages = this.currentPage < totalPages;
  }

  openCreateEventDialog(): void {
    const dialogRef = this.dialog.open(EventCreateAndEditComponent, {
      width: '500px',
      data: {
        userId: this.userId,
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof EventEntity) {
        this.createEvent(result);
      }
    });
  }

  openEditEventDialog(event: EventEntity): void {
    const dialogRef = this.dialog.open(EventCreateAndEditComponent, {
      width: '500px',
      data: {
        event: event,
        userId: this.userId,
        isEditMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof EventEntity) {
        this.updateEvent(result);
      }
    });
  }

  openDeleteConfirmDialog(event: EventEntity): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('EVENTS.CONFIRM_DELETE_TITLE'),
        message: this.translate.instant('EVENTS.CONFIRM_DELETE', { title: event.title }),
        confirmButtonText: this.translate.instant('COMMON.DELETE'),
        cancelButtonText: this.translate.instant('COMMON.CANCEL')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteEvent(event);
      }
    });
  }

  createEvent(event: EventEntity): void {
    this.eventService.createEntity(event).subscribe({
      next: (createdEvent) => {
        this.events.push(createdEvent);
        // Volver a aplicar los filtros actuales
        this.applyEventFilters({
          searchText: this.searchText,
          filterType: this.selectedFilter
        });
        this.showNotification('EVENTS.EVENT_CREATED', 'success');
      },
      error: (error) => {
        this.showNotification('ERRORS.CREATE_EVENT', 'error');
        console.error('Error creating event:', error);
      }
    });
  }

  updateEvent(event: EventEntity): void {
    this.eventService.updateEntity(event).subscribe({
      next: (updatedEvent) => {
        const index = this.events.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          this.events[index] = updatedEvent;
          // Volver a aplicar los filtros actuales
          this.applyEventFilters({
            searchText: this.searchText,
            filterType: this.selectedFilter
          });
        }
        this.showNotification('EVENTS.EVENT_UPDATED', 'success');
      },
      error: (error) => {
        this.showNotification('ERRORS.UPDATE_EVENT', 'error');
        console.error('Error updating event:', error);
      }
    });
  }

  deleteEvent(event: EventEntity): void {
    this.eventService.delete(event.id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== event.id);
        // Volver a aplicar los filtros actuales
        this.applyEventFilters({
          searchText: this.searchText,
          filterType: this.selectedFilter
        });
        this.showNotification('EVENTS.EVENT_DELETED', 'success');
      },
      error: (error) => {
        this.showNotification('ERRORS.DELETE_EVENT', 'error');
        console.error('Error deleting event:', error);
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(this.translate.instant(message), this.translate.instant('COMMON.CLOSE'), {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
