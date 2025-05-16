// task-board.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TaskBoard } from '../../model/task-board-api.entity';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {
  @Input() board: TaskBoard;
  @Output() boardSelected = new EventEmitter<TaskBoard>();

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  selectBoard(): void {
    this.boardSelected.emit(this.board);
    this.taskService.setActiveBoard(this.board);
  }
}
