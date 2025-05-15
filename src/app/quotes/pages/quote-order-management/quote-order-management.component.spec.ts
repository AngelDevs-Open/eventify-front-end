import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOrderManagementComponent } from './quote-order-management.component';

describe('QuoteOrderManagementComponent', () => {
  let component: QuoteOrderManagementComponent;
  let fixture: ComponentFixture<QuoteOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteOrderManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
