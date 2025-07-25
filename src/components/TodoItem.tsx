import React, { useState } from 'react';
import { Check, Edit3, Trash2, User } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="w-full text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 text-base"
              autoFocus
            />
          ) : (
            <p
              className={`text-gray-900 text-base leading-relaxed cursor-pointer ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
              onClick={() => setIsEditing(true)}
            >
              {todo.text}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{todo.createdBy}</span>
            </div>
            <span>•</span>
            <span>{formatTime(todo.createdAt)}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
