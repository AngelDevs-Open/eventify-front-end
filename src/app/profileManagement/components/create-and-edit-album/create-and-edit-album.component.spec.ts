import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndEditAlbumComponent } from './create-and-edit-album.component';

describe('CreateAndEditAlbumComponent', () => {
  let component: CreateAndEditAlbumComponent;
  let fixture: ComponentFixture<CreateAndEditAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAndEditAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAndEditAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
