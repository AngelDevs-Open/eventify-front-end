import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProfileModel } from '../model/profile-model';
import { ProfileInformationModel } from '../model/profile-information-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.serverBaseUrl}/profiles`; // Usa serverBaseUrl en lugar de apiUrl

  constructor(private http: HttpClient) {}

  // Obtener perfil del usuario
  getProfile(userId: string): Observable<ProfileModel> {
    return this.http.get<ProfileModel>(`${this.apiUrl}/${userId}`).pipe(
      map(profile => this.enrichProfileData(profile)),
      catchError(error => {
        console.error('Error al obtener el perfil', error);
        // Usando datos mock para desarrollo
        return of(this.getMockProfile(userId));
      })
    );
  }

  // Actualizar perfil del usuario
  updateProfile(profile: ProfileModel): Observable<ProfileModel> {
    return this.http.put<ProfileModel>(`${this.apiUrl}/${profile.id}`, profile).pipe(
      catchError(error => {
        console.error('Error al actualizar el perfil', error);
        return throwError(() => new Error('No se pudo actualizar el perfil'));
      })
    );
  }

  // Actualizar información del perfil
  updateProfileInformation(profileId: string, information: ProfileInformationModel): Observable<ProfileInformationModel> {
    if (!this.validateProfileInformation(information)) {
      return throwError(() => new Error('Información de perfil inválida'));
    }

    return this.http.put<ProfileInformationModel>(`${this.apiUrl}/${profileId}/information`, information).pipe(
      catchError(error => {
        console.error('Error al actualizar la información del perfil', error);
        return throwError(() => new Error('No se pudo actualizar la información del perfil'));
      })
    );
  }

  // Validar la información del perfil
  private validateProfileInformation(information: ProfileInformationModel): boolean {
    if (information.phoneNumber && !/^\+?[0-9]{10,15}$/.test(information.phoneNumber)) {
      return false;
    }
    return true;
  }

  // Transformar datos del perfil según sea necesario
  private enrichProfileData(profile: ProfileModel): ProfileModel {
    return {
      ...profile,
      displayName: profile.displayName || 'Usuario',
      photoUrl: profile.photoUrl || 'assets/images/default-avatar.png'
    };
  }

  // Datos mock para desarrollo
  private getMockProfile(userId: string): ProfileModel {
    return {
      id: '1',
      userId: userId,
      displayName: 'Usuario de Prueba',
      email: 'usuario@example.com',
      photoUrl: 'assets/images/default-avatar.png',
      bio: 'Esta es una biografía de ejemplo para probar la funcionalidad del perfil.',
      createdAt: new Date(),
      updatedAt: new Date(),
      information: {
        id: '1',
        profileId: '1',
        phoneNumber: '+1234567890',
        address: 'Calle Principal 123',
        city: 'Ciudad Ejemplo',
        country: 'País Ejemplo',
        jobTitle: 'Desarrollador',
        company: 'Empresa Ejemplo',
        education: 'Universidad Ejemplo',
        socialLinks: {
          facebook: 'https://facebook.com/usuario',
          twitter: 'https://twitter.com/usuario',
          linkedin: 'https://linkedin.com/in/usuario',
          github: 'https://github.com/usuario'
        }
      }
    };
  }
}
