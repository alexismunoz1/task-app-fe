import { useState } from "react";
import { Task } from "../../lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "../../icons/TrashIcon";
import { SkeletonCard } from "./SkeletonCard";
import { useTaskStore } from "../../store/taskStore";

interface Props {
  task: Task;
}

export const TaskCard = ({ task }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const { deleteTask, updateContentTask } = useTaskStore();

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { type: "Task", task },
      disabled: editMode,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return <SkeletonCard setNodeRef={setNodeRef} style={style} />;
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative'>
        <textarea
          autoFocus
          defaultValue={task.content}
          placeholder='Task content here'
          onBlur={toggleEditMode}
          onChange={(e) => updateContentTask(task.id, e.target.value)}
          className='h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none'
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task'
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}>
      <p className='my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'>
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className='stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100'>
          <TrashIcon />
        </button>
      )}
    </div>
  );
};
