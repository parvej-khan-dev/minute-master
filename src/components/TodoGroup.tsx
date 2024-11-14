import React from 'react';
import { Clock } from 'lucide-react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { calculateTotalDuration, formatDuration } from '../utils';

interface TodoGroupProps {
  title: string;
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onToggleTimer: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoGroup({ title, todos, onToggleComplete, onToggleTimer, onDelete }: TodoGroupProps) {
  if (todos.length === 0) return null;

  const totalDuration = calculateTotalDuration(todos);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatDuration(totalDuration)}</span>
        </div>
      </div>
      <div className="space-y-3">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onToggleTimer={onToggleTimer}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}