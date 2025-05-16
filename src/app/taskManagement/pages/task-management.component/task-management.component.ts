// task-management.component.ts
import { Component, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { TaskBoard } from '../../model/task-board-api.entity';
import { TaskColumn } from '../../model/task-column.entity';
import { Task } from '../../model/task.entity';
import { MatDialog } from '@angular/material/dialog';
import { TaskItemDialogComponent } from '../components/task-item/task-item-dialog.component';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  imports: [
    MatToolbar,
    MatIcon,
    MatIcon,
    CdkDropListGroup,
    MatIconButton,
    NgForOf,
    CdkDropList,
    CdkDrag,
    MatIcon,
    NgIf,
    NgClass,
    DatePipe,
    MatButton
  ],
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit {
  currentBoard: TaskBoard;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard(): void {
    this.taskService.getActiveBoard().subscribe(board => {
      this.currentBoard = board;
    });
  }

  // Handles dropping task items between columns
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // Move within the same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Move to another column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the task's column ID
      const taskId = event.container.data[event.currentIndex].id;
      const newColumnId = event.container.id;
      this.taskService.updateTaskColumn(taskId, newColumnId);
    }
  }

  addColumn(): void {
    const title = prompt('Enter column title:');
    if (title) {
      this.taskService.addColumn(this.currentBoard.id, title).subscribe(column => {
        this.currentBoard.columns.push(column);
      });
    }
  }

  addTask(columnId: string): void {
    const dialogRef = this.dialog.open(TaskItemDialogComponent, {
      width: '500px',
      data: { columnId: columnId, boardId: this.currentBoard.id, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoard(); // Refresh to show new task
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskItemDialogComponent, {
      width: '500px',
      data: { task: task, isNew: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoard(); // Refresh to show updates
      }
    });
  }

  deleteColumn(column: TaskColumn): void {
    if (confirm(`Are you sure you want to delete column "${column.title}" and all its tasks?`)) {
      this.taskService.deleteColumn(column.id).subscribe(() => {
        const index = this.currentBoard.columns.findIndex(c => c.id === column.id);
        if (index !== -1) {
          this.currentBoard.columns.splice(index, 1);
        }
      });
    }
  }
}
