import axios from "axios";
import { Task } from "./types";

export const taskAppApi = axios.create({
  baseURL: "https://task-app-six-liart.vercel.app/api",
});

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await taskAppApi.get("/task/getTask");
  return data;
};

export const addTask = async (taskId: string, columnId: string, content: string) => {
  const res = await taskAppApi.post("/task/addTask", {
    taskId,
    columnId,
    content,
  });
  return res.data;
};

export const updateTask = async (taskId: string, content: string) => {
  const res = await taskAppApi.post("/task/updateTask", {
    taskId,
    content,
  });
  return res.data;
};
