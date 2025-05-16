import { Component, OnInit } from '@angular/core';
import {ProfileModel} from '../../../model/profile-model';
import {ProfileService} from '../../../services/profile.service';
import {ProfileInformationModel} from '../../../model/profile-information-model';


@Component({
  selector: 'app-profile-information-management',
  templateUrl: './profile-information-management.component.html',
  styleUrls: ['./profile-information-management.component.scss']
})
export class ProfileInformationManagementComponent implements OnInit {
  profile!: ProfileModel;
  loading = false;
  error: string | null = null;

  // Simular ID de usuario en sesión
  private userId = '123'; // En una implementación real, esto vendría de un servicio de autenticación

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile(this.userId).subscribe({
      next: (profile: ProfileModel) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar el perfil';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onProfileUpdate(profile: ProfileModel): void {
    this.loading = true;
    this.profileService.updateProfile(profile).subscribe({
      next: (updatedProfile: ProfileModel) => {
        this.profile = updatedProfile;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al actualizar el perfil';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onInformationUpdate(information: ProfileInformationModel): void {
    if (this.profile) {
      this.loading = true;
      this.profileService.updateProfileInformation(this.profile.id, information).subscribe({
        next: (updatedInfo: ProfileInformationModel) => {
          this.profile = {
            ...this.profile,
            information: updatedInfo
          };
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al actualizar la información del perfil';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
