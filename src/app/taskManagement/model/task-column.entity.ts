
// task-column.entity.ts
import { Task } from './task.entity';

export interface TaskColumn {
  id: string;
  title: string;
  boardId: string;
  position: number;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
