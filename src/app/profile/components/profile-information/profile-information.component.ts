import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProfileInformationModel } from '../../model/profile-information-model';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class ProfileInformationComponent implements OnInit {
  @Input() information!: ProfileInformationModel;
  @Output() informationUpdate = new EventEmitter<ProfileInformationModel>();

  infoForm!: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      phoneNumber: [this.information?.phoneNumber || '', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      address: [this.information?.address || ''],
      city: [this.information?.city || ''],
      country: [this.information?.country || ''],
      jobTitle: [this.information?.jobTitle || ''],
      company: [this.information?.company || ''],
      education: [this.information?.education || ''],
      facebook: [this.information?.socialLinks?.facebook || ''],
      twitter: [this.information?.socialLinks?.twitter || ''],
      linkedin: [this.information?.socialLinks?.linkedin || ''],
      github: [this.information?.socialLinks?.github || '']
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.initForm();
    this.isEditing = false;
  }

  saveChanges(): void {
    if (this.infoForm.valid) {
      const formValues = this.infoForm.value;

      const updatedInfo: ProfileInformationModel = {
        ...this.information,
        phoneNumber: formValues.phoneNumber,
        address: formValues.address,
        city: formValues.city,
        country: formValues.country,
        jobTitle: formValues.jobTitle,
        company: formValues.company,
        education: formValues.education,
        socialLinks: {
          facebook: formValues.facebook,
          twitter: formValues.twitter,
          linkedin: formValues.linkedin,
          github: formValues.github
        }
      };

      this.informationUpdate.emit(updatedInfo);
      this.isEditing = false;
    }
  }
}
