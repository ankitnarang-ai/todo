export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface UndoState {
  todo: Todo;
  timeoutId: NodeJS.Timeout;
}
