import React from 'react';
import { CheckCircle2, XCircle, PlayCircle, StopCircle, Trash2 } from 'lucide-react';
import { Todo } from '../types';
import { formatDuration } from '../utils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onToggleTimer: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggleComplete, onToggleTimer, onDelete }: TodoItemProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        todo.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-indigo-100'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => onToggleComplete(todo.id)}
            className="focus:outline-none"
          >
            {todo.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-gray-400" />
            )}
          </button>
          <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.text}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {formatDuration(todo.duration)}
          </span>
          <button
            onClick={() => onToggleTimer(todo.id)}
            className="focus:outline-none"
          >
            {todo.isRunning ? (
              <StopCircle className="w-6 h-6 text-red-500 hover:text-red-600" />
            ) : (
              <PlayCircle className="w-6 h-6 text-green-500 hover:text-green-600" />
            )}
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="focus:outline-none"
          >
            <Trash2 className="w-6 h-6 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
      {(todo.startTime || todo.stopTime) && (
        <div className="mt-2 text-xs text-gray-500">
          {todo.startTime && (
            <span>Started: {new Date(todo.startTime).toLocaleString()}</span>
          )}
          {todo.stopTime && (
            <span className="ml-4">Stopped: {new Date(todo.stopTime).toLocaleString()}</span>
          )}
        </div>
      )}
    </div>
  );
}