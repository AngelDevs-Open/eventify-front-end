import { Component, OnInit, AfterViewInit } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Album, AlbumPage } from "../../model/album.entity"
import { AlbumService } from "../../services/album.service"
import { CreateAndEditAlbumComponent, DialogMode } from "../create-and-edit-album/create-and-edit-album.component"

@Component({
  selector: "app-profile-albums",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: "./profile-albums.component.html",
  styleUrls: ["./profile-albums.component.css"],
})
export class ProfileAlbumsComponent implements OnInit, AfterViewInit {
  // Albums data
  albumPage: AlbumPage | null = null
  loading = true
  error = false

  // Pagination settings
  pageSizeOptions: number[] = [5, 10, 15]
  pageSize = 5
  pageIndex = 0

  // Mostrar paginador (lo activamos por defecto)
  showPaginator = true;

  // Forzar la paginación para testeo
  totalItemsForcing = 25; // Establece un número mayor que los elementos por página

  // Profile ID (would normally come from a route parameter or parent component)
  profileId = 1

  constructor(
    private albumService: AlbumService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  ngAfterViewInit(): void {
    // Verificar si la paginación está visible después de que la vista se ha inicializado
    setTimeout(() => {
      console.log('Comprobando paginación en AfterViewInit');
      if (this.albumPage && !this.showPaginator) {
        this.showPaginator = true;
      }
    }, 500);
  }

  /**
   * Load albums with pagination
   */
  loadAlbums(): void {
    this.loading = true;
    this.error = false;

    console.log(`Cargando álbumes: profileId=${this.profileId}, page=${this.pageIndex + 1}, size=${this.pageSize}`);

    // Get albums from service with pagination
    this.albumService.getAlbumsByProfile(this.profileId, this.pageIndex + 1, this.pageSize).subscribe({
      next: (page) => {
        this.albumPage = {
          ...page,
          // Forzar un número total de elementos para pruebas
          totalItems: this.totalItemsForcing > 0 ? this.totalItemsForcing : page.totalItems
        };
        this.loading = false;
        console.log('Álbumes cargados:', this.albumPage);

        // Asegurarnos que showPaginator es true siempre que tengamos datos
        this.showPaginator = true;
        console.log('Mostrar paginador:', this.showPaginator);
      },
      error: (err) => {
        console.error("Error loading albums", err);
        this.error = true;
        this.loading = false;
        this.showErrorMessage("Failed to load albums. Please try again later.");
      },
    });
  }

  /**
   * Handle page change events from the paginator
   */
  onPageChange(event: PageEvent): void {
    console.log('Evento de paginación:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }

  /**
   * Create a new album
   */
  createNewAlbum(): void {
    this.openAlbumDialog();
  }

  /**
   * View an album
   */
  viewAlbum(album: Album): void {
    this.viewAlbumDetails(album);
  }

  /**
   * Edit an album
   */
  editAlbum(album: Album): void {
    this.openAlbumDialog(album);
  }

  /**
   * Open dialog to create or edit an album
   */
  openAlbumDialog(album?: Album): void {
    const mode: DialogMode = album ? "edit" : "create";
    console.log(`Abriendo diálogo en modo ${mode}`);

    if (album) {
      console.log(`Editando álbum con ID: ${album.id}`);
    }

    const dialogRef = this.dialog.open(CreateAndEditAlbumComponent, {
      width: "600px",
      data: {
        album: album
          ? { ...album }  // Hacemos una copia para evitar modificar el original directamente
          : {
            profileId: this.profileId,
            photoCount: 0,
            date: new Date(),
          },
        mode: mode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        console.log('Diálogo cerrado con resultado:', result);
        console.log('¿Tiene ID?', result.id ? 'Sí: ' + result.id : 'No');

        if (result.id !== undefined && result.id !== null) {
          console.log(`Actualizando álbum con ID: ${result.id}`);

          // Update existing album
          this.albumService.updateAlbum(result).subscribe({
            next: (updatedAlbum) => {
              console.log('Álbum actualizado exitosamente:', updatedAlbum);
              this.showSuccessMessage("Album updated successfully");
              this.loadAlbums();
            },
            error: (err) => {
              console.error("Error updating album", err);
              this.showErrorMessage(`Failed to update album: ${err.message}`);
              this.loading = false;
            },
          });
        } else {
          // Create new album
          console.log('Creando nuevo álbum (sin ID)');
          this.albumService.createAlbum(result).subscribe({
            next: (createdAlbum) => {
              console.log('Álbum creado exitosamente:', createdAlbum);
              this.showSuccessMessage("Album created successfully");
              this.loadAlbums();
            },
            error: (err) => {
              console.error("Error creating album", err);
              this.showErrorMessage(`Failed to create album: ${err.message}`);
              this.loading = false;
            },
          });
        }
      }
    });
  }

  /**
   * View album details
   */
  viewAlbumDetails(album: Album): void {
    this.dialog.open(CreateAndEditAlbumComponent, {
      width: "600px",
      data: {
        album: album,
        mode: "view" as DialogMode,
      },
    });
  }

  /**
   * Show success message using snackbar
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 3000,
      panelClass: ["success-snackbar"],
    });
  }

  /**
   * Show error message using snackbar
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      panelClass: ["error-snackbar"],
    });
  }
}
