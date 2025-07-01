import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../model/serviceCatalog.entity';
import { ServiceCatalogService } from '../../services/serviceCatalog.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-profile-services',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './profile-services.component.html',
  styleUrls: ['./profile-services.component.css']
})
export class ProfileServicesComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  profileId = 1;

  constructor(private serviceService: ServiceCatalogService) {}

  ngOnInit(): void {
    this.serviceService.getServicesByProfile(this.profileId).subscribe({
      next: services => {
        this.services = services;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading services', err);
        this.loading = false;
      }
    });
  }
}
