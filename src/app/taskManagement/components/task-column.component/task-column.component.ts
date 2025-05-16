// task-column.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskColumn } from '../../model/task-column.entity';
import { Task } from '../../model/task.entity';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-column',
  templateUrl: './task-column.component.html',
  styleUrls: ['./task-column.component.css']
})
export class TaskColumnComponent {
  @Input() column: TaskColumn;
  @Output() addTask = new EventEmitter<string>();
  @Output() deleteColumn = new EventEmitter<TaskColumn>();
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();

  constructor(private taskService: TaskService) { }

  onAddTask(): void {
    this.addTask.emit(this.column.id);
  }

  onDeleteColumn(): void {
    this.deleteColumn.emit(this.column);
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit(event);
  }

  editColumnTitle(): void {
    const newTitle = prompt('Enter new column title:', this.column.title);
    if (newTitle && newTitle !== this.column.title) {
      this.taskService.updateColumnTitle(this.column.id, newTitle).subscribe(() => {
        this.column.title = newTitle;
      });
    }
  }
}
