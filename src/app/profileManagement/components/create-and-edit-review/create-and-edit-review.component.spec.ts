import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndEditReviewComponent } from './create-and-edit-review.component';

describe('CreateAndEditReviewComponent', () => {
  let component: CreateAndEditReviewComponent;
  let fixture: ComponentFixture<CreateAndEditReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAndEditReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAndEditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
