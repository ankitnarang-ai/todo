import React, { useState, useMemo } from 'react';
import { CheckSquare, Users } from 'lucide-react';
import { UserNameInput } from './components/UserNameInput';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoItem } from './components/TodoItem';
import { FilterTabs } from './components/FilterTabs';
import { UndoNotification } from './components/UndoNotification';
import { useTodos } from './hooks/useTodos';
import { FilterType } from './types/todo';

function App() {
  const [userName, setUserName] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { todos, loading, undoStack, addTodo, toggleTodo, editTodo, deleteTodo, undoDelete } = useTodos(userName);

  const filteredTodos = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, activeFilter]);

  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  }), [todos]);

  const handleUndoDismiss = (id: string) => {
    const undoItem = undoStack.find(item => item.todo.id === id);
    if (undoItem) {
      clearTimeout(undoItem.timeoutId);
    }
  };

  if (!userName) {
    return <UserNameInput onSubmit={setUserName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Collaborative Todo</h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>Signed in as <strong>{userName}</strong></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <AddTodoForm onAdd={addTodo} />
          
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading todos...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                {activeFilter === 'active'
                  ? 'No active tasks'
                  : activeFilter === 'completed'
                  ? 'No completed tasks'
                  : 'No tasks yet'}
              </p>
              {activeFilter === 'all' && (
                <p className="text-gray-400 mt-2">Add your first task above</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onEdit={editTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Real-time collaborative todo list • Changes sync instantly</p>
        </div>
      </div>

      <UndoNotification
        undoItems={undoStack}
        onUndo={undoDelete}
        onDismiss={handleUndoDismiss}
      />
    </div>
  );
}

export default App;
