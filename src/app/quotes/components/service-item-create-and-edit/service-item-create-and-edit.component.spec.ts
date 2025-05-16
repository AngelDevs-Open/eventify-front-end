import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceItemCreateAndEditComponent } from './service-item-create-and-edit.component';

describe('ServiceItemCreateAndEditComponent', () => {
  let component: ServiceItemCreateAndEditComponent;
  let fixture: ComponentFixture<ServiceItemCreateAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceItemCreateAndEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceItemCreateAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
