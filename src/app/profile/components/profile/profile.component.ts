import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProfileInformationComponent } from '../profile-information/profile-information.component';
import { ProfileModel } from '../../model/profile-model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    ProfileInformationComponent
  ]
})
export class ProfileComponent implements OnInit {
  @Input() userId!: string;
  profile!: ProfileModel;
  loading = false;
  error: string | null = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    if (!this.userId) {
      this.error = 'ID de usuario no proporcionado';
      return;
    }

    this.loading = true;
    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onProfileUpdate(updatedProfile: ProfileModel): void {
    this.loading = true;
    this.profileService.updateProfile(updatedProfile).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar el perfil';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onInformationUpdate(information: any): void {
    if (this.profile) {
      this.loading = true;
      this.profileService.updateProfileInformation(this.profile.id, information).subscribe({
        next: (updatedInfo) => {
          this.profile = {
            ...this.profile,
            information: updatedInfo
          };
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar la información del perfil';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
