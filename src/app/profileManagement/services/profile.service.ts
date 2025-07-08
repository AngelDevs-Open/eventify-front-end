import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Profile } from "../model/profile.entity";


@Injectable({
  providedIn: "root"
})
export class ProfileService {
  private apiUrl = "http://localhost:3000/profiles"; // URL del JSON server local

  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${id}`)
  }

  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${profile.id}`, profile)
  }

  // Método para actualizar solo la foto de perfil
  updateProfilePhoto(id: number, photoUrl: string): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/${id}`, { photoUrl })
  }
}
