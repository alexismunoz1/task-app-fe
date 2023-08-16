import { TaskCard } from "./TaskCard";
import { Column, Task } from "../lib/types";
import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  tasks: Task[];
}

export const ColumnContainter = ({ column, tasks }: Props) => {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='bg-columnBackgroundColor opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col'></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border border-solid border-[rgba(108,108,108,0.3)] p-1'>
      <div className='flex font-bold text-lg bg-[#0d1117] p-3 rounded-[5px_5px_0_0] z-10 mb-1'>
        <p>{column.title}</p>
      </div>
      <div className='flex overflow-y-auto overflow-x-hidden flex-col grow gap-4 p-2'>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
