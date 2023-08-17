import { useQuery } from "@tanstack/react-query";
import { Task } from "../lib/types";
import { getTasks } from "../lib/api";

const fetchTasks = async (): Promise<Task[]> => {
  const tasks = await getTasks();
  return tasks;
};

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
};
