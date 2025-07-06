import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOrderCreateAndEditComponent } from './quote-order-create-and-edit.component';

describe('QuoteOrderCreateAndEditComponent', () => {
  let component: QuoteOrderCreateAndEditComponent;
  let fixture: ComponentFixture<QuoteOrderCreateAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteOrderCreateAndEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteOrderCreateAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
