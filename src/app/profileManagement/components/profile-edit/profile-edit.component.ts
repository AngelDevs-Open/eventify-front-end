import { Component, Inject, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Profile } from "../../model/profile.entity";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileEditComponent {
  profileForm: FormGroup;
  specialties: string[] = [];
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProfileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Profile, // Usa @Inject con MAT_DIALOG_DATA
  ) {
    this.profileForm = this.fb.group({
      name: [data.name, Validators.required],
      company: [data.company],
      email: [data.email, [Validators.email]],
      phone: [data.phone],
      location: [data.location],
      description: [data.description],
    });

    this.specialties = [...data.specialties];
    this.photoPreview = data.photoUrl || null;
  }

  addSpecialty(event: MatChipInputEvent): void {
    const value = (event.value || "").trim()
    if (value) {
      this.specialties.push(value)
    }
    event.chipInput!.clear()
  }

  removeSpecialty(index: number): void {
    this.specialties.splice(index, 1)
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file

      // Crear una vista previa
      const reader = new FileReader()
      reader.onload = () => {
        this.photoPreview = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true

      // Crear objeto de perfil actualizado
      const updatedProfile: Profile = {
        ...this.data,
        ...this.profileForm.value,
        specialties: this.specialties,
        photoUrl: this.photoPreview || "",
      }

      // Simular carga de archivo y actualización de perfil
      setTimeout(() => {
        // En un caso real, aquí subirías la imagen y obtendrías la URL

        this.profileService.updateProfile(updatedProfile).subscribe({
          next: () => {
            this.snackBar.open("Perfil actualizado con éxito", "Cerrar", {
              duration: 3000,
            })
            this.dialogRef.close(updatedProfile)
          },
          error: (error) => {
            console.error("Error al actualizar el perfil", error)
            this.snackBar.open("Error al actualizar el perfil", "Cerrar", {
              duration: 3000,
            })
            this.isSubmitting = false
          },
        })
      }, 1000)
    }
  }
}
