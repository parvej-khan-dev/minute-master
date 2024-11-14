export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  startTime?: string;
  stopTime?: string;
  isRunning: boolean;
  duration: number;
}