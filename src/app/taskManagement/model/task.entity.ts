// task.entity.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  assignee?: string;
  labels?: string[];
  columnId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
