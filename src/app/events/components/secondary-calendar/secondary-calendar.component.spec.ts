import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryCalendarComponent } from './secondary-calendar.component';

describe('SecondaryCalendarComponent', () => {
  let component: SecondaryCalendarComponent;
  let fixture: ComponentFixture<SecondaryCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
