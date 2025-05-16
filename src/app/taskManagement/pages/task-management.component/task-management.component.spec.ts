import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagementComponentComponent } from './task-management.component';

describe('TaskManagementComponentComponent', () => {
  let component: TaskManagementComponentComponent;
  let fixture: ComponentFixture<TaskManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManagementComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
