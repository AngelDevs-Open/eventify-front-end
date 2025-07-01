import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../model/serviceCatalog.entity';

@Injectable({
  providedIn: 'root'
})
export class ServiceCatalogService {
  private apiUrl = 'http://localhost:3000/services';

  constructor(private http: HttpClient) {}

  getServicesByProfile(profileId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}?profileId=${profileId}`);
  }

  createService(service: Partial<Service>): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(service: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${service.id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
