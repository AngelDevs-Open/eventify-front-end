import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskColumnComponentComponent } from './task-column.component';

describe('TaskColumnComponentComponent', () => {
  let component: TaskColumnComponentComponent;
  let fixture: ComponentFixture<TaskColumnComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskColumnComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskColumnComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
