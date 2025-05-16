import { TestBed } from '@angular/core/testing';

import { QuoteOrderService } from './quote-order.service';

describe('QuoteOrderService', () => {
  let service: QuoteOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
