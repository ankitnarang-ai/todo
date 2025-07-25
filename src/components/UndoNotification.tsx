import React from 'react';
import { Undo2, X } from 'lucide-react';
import { UndoState } from '../types/todo';

interface UndoNotificationProps {
  undoItems: UndoState[];
  onUndo: (todo: UndoState['todo']) => void;
  onDismiss: (id: string) => void;
}

export const UndoNotification: React.FC<UndoNotificationProps> = ({ undoItems, onUndo, onDismiss }) => {
  if (undoItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 space-y-2 z-50">
      {undoItems.map((item) => (
        <div
          key={item.todo.id}
          className="bg-gray-900 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up"
        >
          <div className="flex-1">
            <p className="text-sm font-medium">Task deleted</p>
            <p className="text-xs text-gray-300 truncate">{item.todo.text}</p>
          </div>
          <button
            onClick={() => onUndo(item.todo)}
            className="flex items-center gap-1 px-3 py-1 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={() => onDismiss(item.todo.id)}
            className="p-1 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
