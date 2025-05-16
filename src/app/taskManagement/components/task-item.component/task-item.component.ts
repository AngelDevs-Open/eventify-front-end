// task-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../model/task.entity';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task: Task;
  @Output() editTask = new EventEmitter<Task>();

  getPriorityClass(): string {
    if (!this.task.priority) return '';
    return `priority-${this.task.priority.toLowerCase()}`;
  }

  onEditTask(): void {
    this.editTask.emit(this.task);
  }
}
