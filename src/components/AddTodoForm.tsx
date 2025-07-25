import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>
    </form>
  );
};
