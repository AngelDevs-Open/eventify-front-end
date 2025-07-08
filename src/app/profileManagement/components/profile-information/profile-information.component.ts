import { Component, Input } from "@angular/core"
import type { Profile } from "../../model/profile.entity"

@Component({
  selector: "app-profile-information",
  templateUrl: "./profile-information.component.html",
  styleUrls: ["./profile-information.component.css"]
})
export class ProfileInformationComponent {
  @Input() profile!: Profile
}
