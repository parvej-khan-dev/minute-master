import React, { useState, useEffect } from "react";
import { Timer, Clock } from "lucide-react";
import { TodoForm } from "./components/TodoForm";
import { TodoGroup } from "./components/TodoGroup";
import { ExportPDF } from "./components/ExportPDF";
import { Todo } from "./types";
import { groupTodos, calculateTotalDuration, formatDuration } from "./utils";

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.isRunning ? { ...todo, duration: todo.duration + 1 } : todo
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTodo = (text: string) => {
    setTodos((currentTodos) => {
      // Stop any currently running tasks
      const updatedTodos = currentTodos.map((todo) =>
        todo.isRunning
          ? {
              ...todo,
              isRunning: false,
              stopTime: new Date().toISOString(),
            }
          : todo
      );

      // Add the new task
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        isRunning: true,
        startTime: new Date().toISOString(),
        duration: 0,
      };

      return [...updatedTodos, newTodo];
    });
  };

  const toggleTimer = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          if (!todo.isRunning) {
            return {
              ...todo,
              startTime: new Date().toISOString(),
              stopTime: undefined,
              isRunning: true,
            };
          } else {
            return {
              ...todo,
              stopTime: new Date().toISOString(),
              isRunning: false,
            };
          }
        }
        return todo;
      })
    );
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const { groups, olderWeeks } = groupTodos(todos);
  const totalTime = calculateTotalDuration(todos);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Timer className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">MinuteMaster</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">
                {formatDuration(totalTime)}
              </span>
            </div>
          </div>

          <ExportPDF todos={todos} />
          <TodoForm onAdd={addTodo} />

          <div className="mt-8">
            <TodoGroup
              title="Today"
              todos={groups.today}
              onToggleComplete={toggleComplete}
              onToggleTimer={toggleTimer}
              onDelete={deleteTodo}
            />

            <TodoGroup
              title="Yesterday"
              todos={groups.yesterday}
              onToggleComplete={toggleComplete}
              onToggleTimer={toggleTimer}
              onDelete={deleteTodo}
            />

            <TodoGroup
              title="This Week"
              todos={groups.thisWeek}
              onToggleComplete={toggleComplete}
              onToggleTimer={toggleTimer}
              onDelete={deleteTodo}
            />

            {Object.entries(olderWeeks).map(([weekKey, weekTodos]) => (
              <TodoGroup
                key={weekKey}
                title={weekKey}
                todos={weekTodos}
                onToggleComplete={toggleComplete}
                onToggleTimer={toggleTimer}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
