import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemComponentComponent } from './task-item.component';

describe('TaskItemComponentComponent', () => {
  let component: TaskItemComponentComponent;
  let fixture: ComponentFixture<TaskItemComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItemComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
