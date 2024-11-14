import { Todo } from "../types";

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const calculateTotalDuration = (todos: Todo[]): number => {
  return todos.reduce((total, todo) => total + todo.duration, 0);
};

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

export const isThisWeek = (date: Date) => {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  weekStart.setHours(0, 0, 0, 0);
  return date >= weekStart;
};

export const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const groupTodos = (todos: Todo[]) => {
  const groups: Record<string, Todo[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
  };

  const olderWeeks: Record<string, Todo[]> = {};

  todos.forEach((todo) => {
    const startDate = new Date(todo.startTime || "");

    if (isToday(startDate)) {
      groups.today.push(todo);
    } else if (isYesterday(startDate)) {
      groups.yesterday.push(todo);
    } else if (isThisWeek(startDate)) {
      groups.thisWeek.push(todo);
    } else {
      const weekKey = `Week ${getWeekNumber(startDate)}`;
      if (!olderWeeks[weekKey]) {
        olderWeeks[weekKey] = [];
      }
      olderWeeks[weekKey].push(todo);
    }
  });

  return { groups, olderWeeks };
};
