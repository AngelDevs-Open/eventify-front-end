import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { EventStatusEnum } from '../../model/event-status.entity';

export interface EventFilters {
  searchText: string;
  filterType: string;
  statusFilter?: EventStatusEnum | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

@Component({
  selector: 'app-event-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  templateUrl: './event-filters.component.html',
  styleUrls: ['./event-filters.component.css']
})
export class EventFiltersComponent implements OnInit {
  @Input() showAdvancedFilters: boolean = false;
  @Output() filtersChanged = new EventEmitter<EventFilters>();
  @Output() toggleAdvancedFilters = new EventEmitter<boolean>();

  filters: EventFilters = {
    searchText: '',
    filterType: 'all',
    statusFilter: null,
    dateFrom: null,
    dateTo: null
  };

  statusOptions = Object.values(EventStatusEnum);
  filterOptions = [
    { value: 'all', label: 'EVENTS.ALL' },
    { value: 'recent', label: 'EVENTS.RECENT' },
    { value: 'oldest', label: 'EVENTS.OLDEST' },
    { value: 'alphabetical', label: 'EVENTS.ALPHABETICAL' }
  ];

  constructor() {}

  ngOnInit(): void {}

  applyFilters(): void {
    this.filtersChanged.emit(this.filters);
  }

  clearFilters(): void {
    this.filters = {
      searchText: '',
      filterType: 'all',
      statusFilter: null,
      dateFrom: null,
      dateTo: null
    };
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterTypeChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  onToggleAdvancedFilters(): void {
    this.toggleAdvancedFilters.emit(!this.showAdvancedFilters);
  }
}
