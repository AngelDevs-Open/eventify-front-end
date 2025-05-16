// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TaskBoard } from '../model/task-board-api.entity';
import { TaskColumn } from '../model/task-column.entity';
import { Task } from '../model/task.entity';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'api/tasks'; // Cambiar por tu URL real de API

  // Para uso en desarrollo sin backend
  private mockData = {
    currentBoard: null as TaskBoard | null,
    boards: [
      {
        id: '1',
        title: 'Project Alpha',
        description: 'Main project board',
        columns: [
          {
            id: 'col1',
            title: 'To Do',
            boardId: '1',
            position: 0,
            tasks: [
              {
                id: 'task1',
                title: 'Research competitors',
                description: 'Analyze top 5 competitors',
                priority: 'Medium',
                columnId: 'col1',
                position: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              {
                id: 'task2',
                title: 'Setup development environment',
                description: 'Install and configure all necessary tools',
                priority: 'High',
                columnId: 'col1',
                position: 1,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'col2',
            title: 'In Progress',
            boardId: '1',
            position: 1,
            tasks: [
              {
                id: 'task3',
                title: 'Design landing page',
                description: 'Create wireframes and mockups',
                priority: 'High',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
                assignee: 'Alice',
                labels: ['Design', 'Frontend'],
                columnId: 'col2',
                position: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'col3',
            title: 'Done',
            boardId: '1',
            position: 2,
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        taskCount: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };

  private activeBoardSubject = new BehaviorSubject<TaskBoard | null>(null);
  activeBoard$ = this.activeBoardSubject.asObservable();

  constructor(private http: HttpClient) {
    // Establecer el primer tablero como activo por defecto
    if (this.mockData.boards.length > 0) {
      this.setActiveBoard(this.mockData.boards[0]);
    }
  }

  // Board methods
  getBoards(): Observable<TaskBoard[]> {
    // return this.http.get<TaskBoard[]>(`${this.apiUrl}/boards`);
    return of(this.mockData.boards);
  }

  getBoard(id: string): Observable<TaskBoard> {
    // return this.http.get<TaskBoard>(`${this.apiUrl}/boards/${id}`);
    const board = this.mockData.boards.find(b => b.id === id);
    return of(board as TaskBoard);
  }

  createBoard(boardData: Partial<TaskBoard>): Observable<TaskBoard> {
    // return this.http.post<TaskBoard>(`${this.apiUrl}/boards`, boardData);
    const newBoard: TaskBoard = {
      id: `board-${Date.now()}`,
      title: boardData.title || 'New Board',
      description: boardData.description || '',
      columns: [],
      taskCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockData.boards.push(newBoard);
    return of(newBoard);
  }

  updateBoard(id: string, boardData: Partial<TaskBoard>): Observable<TaskBoard> {
    // return this.http.put<TaskBoard>(`${this.apiUrl}/boards/${id}`, boardData);
    const boardIndex = this.mockData.boards.findIndex(b => b.id === id);
    if (boardIndex !== -1) {
      this.mockData.boards[boardIndex] = {
        ...this.mockData.boards[boardIndex],
        ...boardData,
        updatedAt: new Date()
      };
      return of(this.mockData.boards[boardIndex]);
    }
    return of({} as TaskBoard);
  }

  deleteBoard(id: string): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/boards/${id}`);
    const boardIndex = this.mockData.boards.findIndex(b => b.id === id);
    if (boardIndex !== -1) {
      this.mockData.boards.splice(boardIndex, 1);
    }
    return of(void 0);
  }

  // Column methods
  addColumn(boardId: string, title: string): Observable<TaskColumn> {
    // return this.http.post<TaskColumn>(`${this.apiUrl}/boards/${boardId}/columns`, { title });
    const board = this.mockData.boards.find(b => b.id === boardId);
    if (board) {
      const newColumn: TaskColumn = {
        id: `col-${Date.now()}`,
        title,
        boardId,
        position: board.columns.length,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      board.columns.push(newColumn);
      return of(newColumn);
    }
    return of({} as TaskColumn);
  }

  updateColumnTitle(columnId: string, title: string): Observable<TaskColumn> {
    // return this.http.put<TaskColumn>(`${this.apiUrl}/columns/${columnId}`, { title });
    let updatedColumn: TaskColumn | null = null;

    for (const board of this.mockData.boards) {
      const columnIndex = board.columns.findIndex(c => c.id === columnId);
      if (columnIndex !== -1) {
        board.columns[columnIndex].title = title;
        board.columns[columnIndex].updatedAt = new Date();
        updatedColumn = board.columns[columnIndex];
        break;
      }
    }

    return of(updatedColumn as TaskColumn);
  }

  deleteColumn(columnId: string): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/columns/${columnId}`);
    for (const board of this.mockData.boards) {
      const columnIndex = board.columns.findIndex(c => c.id === columnId);
      if (columnIndex !== -1) {
        board.columns.splice(columnIndex, 1);
        break;
      }
    }
    return of(void 0);
  }

  // Task methods
  addTask(boardId: string, columnId: string, taskData: Partial<Task>): Observable<Task> {
    // return this.http.post<Task>(`${this.apiUrl}/boards/${boardId}/columns/${columnId}/tasks`, taskData);
    const board = this.mockData.boards.find(b => b.id === boardId);
    if (board) {
      const column = board.columns.find(c => c.id === columnId);
      if (column) {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: taskData.title || 'New Task',
          description: taskData.description || '',
          priority: taskData.priority || 'Medium',
          dueDate: taskData.dueDate || undefined,
          assignee: taskData.assignee || undefined,
          labels: taskData.labels || [],
          columnId,
          position: column.tasks.length,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        column.tasks.push(newTask);
        board.taskCount = (board.taskCount || 0) + 1;
        return of(newTask);
      }
    }
    return of({} as Task);
  }

  updateTask(taskData: Task): Observable<Task> {
    // return this.http.put<Task>(`${this.apiUrl}/tasks/${taskData.id}`, taskData);
    let updatedTask: Task | null = null;

    for (const board of this.mockData.boards) {
      for (const column of board.columns) {
        const taskIndex = column.tasks.findIndex(t => t.id === taskData.id);
        if (taskIndex !== -1) {
          column.tasks[taskIndex] = {
            ...column.tasks[taskIndex],
            ...taskData,
            updatedAt: new Date()
          };
          updatedTask = column.tasks[taskIndex];
          break;
        }
      }
      if (updatedTask) break;
    }

    return of(updatedTask as Task);
  }

  updateTaskColumn(taskId: string, newColumnId: string): void {
    let task: Task | null = null;
    let oldColumn: TaskColumn | null = null;
    let newColumn: TaskColumn | null = null;

    // Find the task and columns
    for (const board of this.mockData.boards) {
      for (const column of board.columns) {
        const taskIndex = column.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          task = column.tasks[taskIndex];
          oldColumn = column;
          column.tasks.splice(taskIndex, 1);
        }

        if (column.id === newColumnId) {
          newColumn = column;
        }
      }
    }

    // Update the task's column ID
    if (task && newColumn) {
      task.columnId = newColumnId;
      task.position = newColumn.tasks.length;
      task.updatedAt = new Date();
      newColumn.tasks.push(task);
    }
  }

  deleteTask(taskId: string): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
    for (const board of this.mockData.boards) {
      let taskDeleted = false;

      for (const column of board.columns) {
        const taskIndex = column.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          column.tasks.splice(taskIndex, 1);
          taskDeleted = true;
          break;
        }
      }

      if (taskDeleted && board.taskCount) {
        board.taskCount--;
      }
    }
    return of(void 0);
  }

  // Active board management
  setActiveBoard(board: TaskBoard): void {
    this.mockData.currentBoard = board;
    this.activeBoardSubject.next(board);
  }

  getActiveBoard(): Observable<TaskBoard> {
    if (this.mockData.currentBoard) {
      return of(this.mockData.currentBoard);
    }

    // Si no hay tablero activo, configurar el primero
    if (this.mockData.boards.length > 0) {
      this.setActiveBoard(this.mockData.boards[0]);
      return of(this.mockData.boards[0]);
    }

    return of({} as TaskBoard);
  }
}
