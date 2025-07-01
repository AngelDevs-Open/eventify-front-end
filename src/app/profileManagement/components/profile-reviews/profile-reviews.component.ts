import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Review } from '../../model/review.entity';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-profile-reviews',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './profile-reviews.component.html',
  styleUrls: ['./profile-reviews.component.css']
})
export class ProfileReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  profileId = 1;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getReviewsByProfile(this.profileId).subscribe({
      next: reviews => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading reviews', err);
        this.loading = false;
      }
    });
  }
}
