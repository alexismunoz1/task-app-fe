import { create } from "zustand";
import { Task } from "../lib/types";

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (taskId: string, columnId: string, content: string) => void;
  updateTask: (taskId: string, content: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  addTask: (taskId, columnId, content) => {
    set((state) => ({
      tasks: [...state.tasks, { id: taskId, columnId, content }],
    }));
  },
  updateTask: (taskId, content) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, content } : task
      ),
    }));
  },
}));
