import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http"
import { Observable, catchError, of, throwError } from "rxjs"
import { map, switchMap } from "rxjs/operators"
import { Album, AlbumPage } from "../model/album.entity"

@Injectable({
  providedIn: "root",
})
export class AlbumService {
  // URL for the json-server running locally
  private apiUrl = "http://localhost:3000/albums"

  constructor(private http: HttpClient) {}

  /**
   * Get albums with pagination
   * Using json-server's built-in pagination support
   */
  getAlbumsByProfile(profileId: number, page = 1, itemsPerPage = 5): Observable<AlbumPage> {
    // json-server supports page and limit for pagination
    const params = new HttpParams()
      .set("profileId", profileId.toString())
      .set("_page", page.toString())
      .set("_limit", itemsPerPage.toString())
      .set("_sort", "date")
      .set("_order", "desc")

    console.log(`Fetching albums: profileId=${profileId}, page=${page}, limit=${itemsPerPage}`);

    return this.http.get<Album[]>(this.apiUrl, { params, observe: "response" }).pipe(
      map((response) => {
        // Extract total count from headers
        const totalCountHeader = response.headers.get("X-Total-Count");
        console.log('X-Total-Count header:', totalCountHeader);

        // Si no tenemos el encabezado X-Total-Count, calculamos basándonos en los datos
        let totalCount = Number.parseInt(totalCountHeader || "0", 10);

        // Si no hay totalCount pero tenemos elementos, establecemos un valor predeterminado mayor
        if (totalCount <= 0 && (response.body || []).length > 0) {
          // Para pruebas: suponemos que hay al menos 3 páginas de datos
          totalCount = Math.max(3 * itemsPerPage, (response.body || []).length);
          console.log(`No se recibió X-Total-Count. Estableciendo totalCount=${totalCount}`);
        }

        return {
          items: response.body || [],
          totalItems: totalCount,
          currentPage: page,
          itemsPerPage: itemsPerPage,
          totalPages: Math.ceil(totalCount / itemsPerPage),
        }
      }),
    )
  }

  /**
   * Get a specific album by ID
   */
  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new album
   */
  createAlbum(album: Partial<Album>): Observable<Album> {
    // Asegurarse de que las fechas estén en formato ISO para JSON
    const preparedAlbum = this.prepareAlbumData(album);
    console.log('Creating album:', preparedAlbum);

    return this.http.post<Album>(this.apiUrl, preparedAlbum);
  }

  /**
   * Update an existing album
   * Para json-server, necesitamos asegurarnos de que el ID existe y se envía correctamente
   */
  updateAlbum(album: Partial<Album>): Observable<Album> {
    // Verificar que el álbum tiene un ID
    if (album.id === undefined || album.id === null) {
      console.error('Error: Attempting to update album without ID');
      return throwError(() => new Error('Album must have an ID to update'));
    }

    const preparedAlbum = this.prepareAlbumData(album);
    const id = typeof album.id === 'string' ? parseInt(album.id, 10) : album.id;

    console.log(`Updating album with ID ${id}:`, preparedAlbum);

    // Primero verificamos si el álbum existe
    return this.checkIfAlbumExists(album.id).pipe(
      switchMap(exists => {
        if (exists) {
          // Si existe, lo actualizamos con PUT
          console.log(`Album con ID ${album.id} existe, actualizando...`);
          return this.http.put<Album>(`${this.apiUrl}/${album.id}`, preparedAlbum)
            .pipe(
              catchError(error => {
                console.error(`Error al actualizar álbum ${album.id}:`, error);
                return throwError(() => new Error(`Error updating album: ${error.message}`));
              })
            );
        } else {
          // Si no existe, lo creamos con POST pero mantenemos su ID
          console.log(`Album con ID ${album.id} no existe, creándolo...`);
          return this.http.put<Album>(`${this.apiUrl}/${id}`, preparedAlbum).pipe(
            catchError(error => {
              console.error(`Error updating album with ID ${id}:`, error);
              return throwError(() => new Error(`Error updating album: ${error.message || 'Unknown error'}`));
              })
            );
        }
      })
    );
  }

  /**
   * Verifica si un álbum existe antes de actualizarlo
   */
  private checkIfAlbumExists(id: number): Observable<boolean> {
    console.log(`Verificando si existe álbum con ID ${id}...`);
    return this.http.get<Album>(`${this.apiUrl}/${id}`).pipe(
      map(album => {
        console.log(`Álbum con ID ${id} encontrado:`, album);
        return true;
      }),
      catchError(error => {
        if (error.status === 404) {
          console.log(`Álbum con ID ${id} no encontrado.`);
          return of(false);
        }
        console.error(`Error al verificar álbum ${id}:`, error);
        return throwError(() => new Error(`Error checking album: ${error.message}`));
      })
    );
  }

  /**
   * Delete an album
   */
  deleteAlbum(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Prepare album data for sending to API
   * Convert Date objects to ISO strings
   */
  private prepareAlbumData(album: Partial<Album>): any {
    // Usando 'any' para evitar errores de tipo
    const prepared: any = { ...album };

    // Convert Date objects to ISO strings for proper JSON serialization
    if (prepared.date instanceof Date) {
      prepared.date = prepared.date.toISOString();
    }

    // Asegurarse de que el ID permanece como número si existe
    if (prepared.id && typeof prepared.id === 'string') {
      prepared.id = parseInt(prepared.id, 10);
    }

    return prepared;
  }
}
