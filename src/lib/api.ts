import axios from "axios";
import { Task } from "./types";

export const taskAppApi = axios.create({
  baseURL: "https://parcel-api.onrender.com/api",
});

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await taskAppApi.get("/task");
  return data;
};

export const addTaskApi = async (taskId: string, columnId: string, content: string) => {
  const res = await taskAppApi.post("/task", {
    taskId,
    columnId,
    content,
  });
  return res.data;
};

export const updateTaskApi = async (
  taskId: string,
  columnId?: string,
  content?: string
) => {
  const res = await taskAppApi.patch(`/task/${taskId}`, {
    columnId,
    content,
  });
  return res.data;
};

export const deleteTaskApi = async (taskId: string) => {
  const res = await taskAppApi.delete(`/task/${taskId}`);
  return res.data;
};
