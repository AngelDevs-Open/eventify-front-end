// task-board-api.entity.ts
import { TaskColumn } from './task-column.entity';

export interface TaskBoard {
  id: string;
  title: string;
  description?: string;
  columns: TaskColumn[];
  taskCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
