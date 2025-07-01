import { Component, Inject, ViewChild, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from "@angular/material/button"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatIconModule } from "@angular/material/icon"
import { Album } from "../../model/album.entity"

export type DialogMode = "create" | "edit" | "view"

export interface AlbumDialogData {
  album: Partial<Album>
  mode: DialogMode
}

@Component({
  selector: "app-create-and-edit-album",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: "./create-and-edit-album.component.html",
  styleUrls: ["./create-and-edit-album.component.css"],
})
export class CreateAndEditAlbumComponent implements OnInit {
  albumForm: FormGroup
  mode: DialogMode
  imagePreview: string | null = null
  @ViewChild('picker') picker: any;
  albumId: number | null = null;

  // Getters for template conditions
  get isViewMode(): boolean {
    return this.mode === "view"
  }

  get isEditMode(): boolean {
    return this.mode === "edit"
  }

  get isCreateMode(): boolean {
    return this.mode === "create"
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case "create":
        return "Create New Album"
      case "edit":
        return "Edit Album"
      case "view":
        return "Album Details"
      default:
        return "Album"
    }
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateAndEditAlbumComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AlbumDialogData,
  ) {
    this.mode = dialogData.mode;

    // Guardar el ID original si estamos en modo edición
    if (dialogData.album && dialogData.album.id) {
      this.albumId = dialogData.album.id;
      console.log(`ID original del álbum almacenado: ${this.albumId}`);
    }

    // Initialize form - No incluimos el ID en el formulario directamente
    // Lo manejaremos por separado para evitar que se pierda
    this.albumForm = this.fb.group({
      title: [dialogData.album.title || "", [Validators.required, Validators.maxLength(100)]],
      date: [dialogData.album.date ? new Date(dialogData.album.date) : new Date(), Validators.required],
      description: [dialogData.album.description || "", Validators.maxLength(500)],
      coverImage: [dialogData.album.coverImage || ""],
      photoCount: [dialogData.album.photoCount || 0],
      profileId: [dialogData.album.profileId],
    });

    // Set image preview
    this.imagePreview = dialogData.album.coverImage || null;

    // Disable form in view mode
    if (this.isViewMode) {
      this.albumForm.disable();
    }
  }

  ngOnInit(): void {
    console.log(`Componente inicializado en modo: ${this.mode}`);
    console.log(`ID del álbum: ${this.albumId}`);
    console.log('Valores iniciales del formulario:', this.albumForm.value);
  }

  openDatepicker(): void {
    this.picker.open();
  }

  onSubmit(): void {
    if (this.albumForm.valid) {
      // Obtenemos los valores del formulario
      const formValues = this.albumForm.value;

      // Creamos un nuevo objeto con los valores del formulario
      const albumData: Partial<Album> = {
        ...formValues,
        // Añadimos explícitamente el ID si estamos en modo edición
        ...(this.albumId !== null && { id: this.albumId })
      };

      console.log(`Modo actual: ${this.mode}, ID del álbum: ${this.albumId}`);
      console.log('Enviando datos del álbum:', albumData);

      this.dialogRef.close(albumData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.albumForm.patchValue({
          coverImage: this.imagePreview,
        });
      };

      reader.readAsDataURL(file);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
