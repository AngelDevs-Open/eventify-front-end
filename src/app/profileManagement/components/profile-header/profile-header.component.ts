import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Profile } from "../../model/profile.entity";
import { ProfileEditComponent } from "../profile-edit/profile-edit.component";

@Component({
  selector: "app-profile-header",
  templateUrl: "./profile-header.component.html",
  styleUrls: ["./profile-header.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ProfileHeaderComponent {
  @Input() profile!: Profile;
  @Output() editProfile = new EventEmitter<void>();
  constructor(private dialog: MatDialog) {}

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return [
      ...Array(fullStars).fill("star"),
      ...(halfStar ? ["star_half"] : []),
      ...Array(emptyStars).fill("star_border"),
    ]
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: "600px",
      data: this.profile, // Pasa el perfil como data
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editProfile.emit();
      }
    });
  }
}
