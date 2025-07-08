import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAlbumsComponent } from './profile-albums.component';

describe('ProfileAlbumsComponent', () => {
  let component: ProfileAlbumsComponent;
  let fixture: ComponentFixture<ProfileAlbumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAlbumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
