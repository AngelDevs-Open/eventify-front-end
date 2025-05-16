// task.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return mock boards', (done: DoneFn) => {
    service.getBoards().subscribe(boards => {
      expect(boards.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should add a new column', (done: DoneFn) => {
    service.getBoards().subscribe(boards => {
      const boardId = boards[0].id;
      const initialColumnCount = boards[0].columns.length;

      service.addColumn(boardId, 'New Test Column').subscribe(newColumn => {
        expect(newColumn).toBeTruthy();
        expect(newColumn.title).toBe('New Test Column');

        service.getBoard(boardId).subscribe(updatedBoard => {
          expect(updatedBoard.columns.length).toBe(initialColumnCount + 1);
          done();
        });
      });
    });
  });

  it('should add a new task', (done: DoneFn) => {
    service.getBoards().subscribe(boards => {
      const boardId = boards[0].id;
      const columnId = boards[0].columns[0].id;
      const initialTaskCount = boards[0].columns[0].tasks.length;

      const newTask = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'Medium' as 'Medium'
      };

      service.addTask(boardId, columnId, newTask).subscribe(task => {
        expect(task).toBeTruthy();
        expect(task.title).toBe('Test Task');

        service.getBoard(boardId).subscribe(updatedBoard => {
          const column = updatedBoard.columns.find(c => c.id === columnId);
          expect(column?.tasks.length).toBe(initialTaskCount + 1);
          done();
        });
      });
    });
  });

  it('should update task column when moved', (done: DoneFn) => {
    service.getBoards().subscribe(boards => {
      const board = boards[0];
      const sourceColumn = board.columns[0];
      const targetColumn = board.columns[1];

      if (sourceColumn.tasks.length > 0) {
        const taskToMove = sourceColumn.tasks[0];
        const initialSourceCount = sourceColumn.tasks.length;
        const initialTargetCount = targetColumn.tasks.length;

        service.updateTaskColumn(taskToMove.id, targetColumn.id);

        service.getBoard(board.id).subscribe(updatedBoard => {
          const updatedSource = updatedBoard.columns.find(c => c.id === sourceColumn.id);
          const updatedTarget = updatedBoard.columns.find(c => c.id === targetColumn.id);

          expect(updatedSource?.tasks.length).toBe(initialSourceCount - 1);
          expect(updatedTarget?.tasks.length).toBe(initialTargetCount + 1);

          const movedTask = updatedTarget?.tasks.find(t => t.id === taskToMove.id);
          expect(movedTask).toBeTruthy();
          expect(movedTask?.columnId).toBe(targetColumn.id);

          done();
        });
      } else {
        done();
      }
    });
  });
});
