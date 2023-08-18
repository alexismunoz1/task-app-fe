import { create } from "zustand";
import { Task } from "../lib/types";
import { deleteTaskApi, addTaskApi, updateTaskApi } from "../lib/api";

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addNewTask: (taskId: string, columnId: string, content: string) => void;
  updateContentTask: (taskId: string, columnId: string, content: string) => void;
  updateColumnId: (taskId: string, columnId: string) => void;
  deleteTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  addNewTask: async (taskId, columnId, content) => {
    set((prevState) => ({
      tasks: [...prevState.tasks, { id: taskId, columnId, content }],
    }));

    await addTaskApi(taskId, columnId, content);
  },

  updateContentTask: async (taskId, columnId, content) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId, content } : task
      ),
    }));

    await updateTaskApi(taskId, columnId, content);
  },

  updateColumnId: async (taskId, columnId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId } : task
      ),
    }));

    await updateTaskApi(taskId, columnId);
  },

  deleteTask: async (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));

    await deleteTaskApi(taskId);
  },
}));
