import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInformationManagementComponent } from './profile-information-management.component';

describe('ProfileInformationManagementComponent', () => {
  let component: ProfileInformationManagementComponent;
  let fixture: ComponentFixture<ProfileInformationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInformationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileInformationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
