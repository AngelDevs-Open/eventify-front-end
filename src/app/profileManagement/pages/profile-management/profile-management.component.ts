import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";

import { ProfileService } from "../../services/profile.service";
import { ProfileHeaderComponent } from "../../components/profile-header/profile-header.component";
import { ProfileInformationComponent } from "../../components/profile-information/profile-information.component";
import { ProfileServicesComponent } from "../../components/profile-services/profile-services.component";
import { ProfileAlbumsComponent } from "../../components/profile-albums/profile-albums.component";
import { ProfileReviewsComponent } from "../../components/profile-reviews/profile-reviews.component";
import { Profile } from "../../model/profile.entity";

@Component({
  selector: "app-profile-management",
  templateUrl: "./profile-management.component.html",
  styleUrls: ["./profile-management.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ProfileHeaderComponent,
    ProfileInformationComponent,
    ProfileServicesComponent,
    ProfileAlbumsComponent,
    ProfileReviewsComponent
  ]
})
export class ProfileManagementComponent implements OnInit {
  profile: Profile | null = null;
  profileId = 1; // ID por defecto, en un caso real vendría del usuario autenticado

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Obtener ID del perfil de la ruta si existe
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.profileId = +params["id"]
      }
      this.loadProfile()
    })
  }

  loadProfile(): void {
    this.profileService.getProfile(this.profileId).subscribe({
      next: (profile) => {
        this.profile = profile
      },
      error: (error) => {
        console.error("Error al cargar el perfil", error)
        // Cargar datos de ejemplo si hay error (para desarrollo)
        this.loadMockProfile()
      },
    })
  }

  refreshProfile(): void {
    this.loadProfile()
  }

  // Método para cargar datos de ejemplo durante desarrollo
  private loadMockProfile(): void {
    this.profile = {
      id: 1,
      name: "Carlos Rodríguez",
      company: "Eventos Musicales S.L.",
      role: "ORGANIZADOR",
      eventsOrganized: 24,
      rating: 4.2,
      email: "carlos@eventosmusicales.com",
      phone: "+51 962531478",
      location: "Surco, Lima",
      specialties: ["Eventos musicales", "Festivales", "Conciertos"],
      description: "Organizador de eventos con más de 10 años de experiencia en la industria musical. Especializado en festivales y conciertos de gran formato.",
    }
  }
}
