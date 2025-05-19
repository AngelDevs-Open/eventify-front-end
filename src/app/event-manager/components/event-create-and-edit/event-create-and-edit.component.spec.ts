import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreateAndEditComponent } from './event-create-and-edit.component';

describe('EventCreateAndEditComponent', () => {
  let component: EventCreateAndEditComponent;
  let fixture: ComponentFixture<EventCreateAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCreateAndEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCreateAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
