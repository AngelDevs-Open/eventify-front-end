import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileInformationComponent } from './components/profile-information/profile-information.component';

// Pages
import { ProfileInformationManagementComponent } from './pages/profile-information-management/profile-information-management/profile-information-management.component';

// Services
import { ProfileService } from './services/profile.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileInformationManagementComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),

    // Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,

    // Standalone components
    ProfileComponent,
    ProfileInformationComponent,
    ProfileInformationManagementComponent
  ],
  declarations: [

  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
