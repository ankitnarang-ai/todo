import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Todo, UndoState } from '../types/todo';
import { v4 as uuidv4 } from 'uuid';

export const useTodos = (userName: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [undoStack, setUndoStack] = useState<UndoState[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Todo[];
      
      setTodos(todosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTodo = async (text: string) => {
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'todos'), {
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userName,
      });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        completed,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const editTodo = async (id: string, text: string) => {
    if (!text.trim()) return;

    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        text: text.trim(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      // Delete from Firestore
      await deleteDoc(doc(db, 'todos', id));

      // Add to undo stack with 5-second timeout
      const timeoutId = setTimeout(() => {
        setUndoStack(prev => prev.filter(item => item.todo.id !== id));
      }, 5000);

      setUndoStack(prev => [...prev, { todo, timeoutId }]);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const undoDelete = async (todo: Todo) => {
    try {
      // Find and clear the timeout
      const undoItem = undoStack.find(item => item.todo.id === todo.id);
      if (undoItem) {
        clearTimeout(undoItem.timeoutId);
        setUndoStack(prev => prev.filter(item => item.todo.id !== todo.id));
      }

      // Re-add to Firestore
      await addDoc(collection(db, 'todos'), {
        text: todo.text,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: new Date(),
        createdBy: todo.createdBy,
      });
    } catch (error) {
      console.error('Error undoing delete:', error);
    }
  };

  return {
    todos,
    loading,
    undoStack,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    undoDelete,
  };
};
