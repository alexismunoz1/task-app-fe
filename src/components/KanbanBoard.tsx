import { useEffect, useMemo, useState } from "react";
import type { Column, Task } from "../lib/types";
import { ColumnContainter } from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard/TaskCard";
import { useGetTasks } from "../hooks/getTasks";
import { useTaskStore } from "../store/taskStore";

const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const KanbanBoard = () => {
  const columnsId = useMemo(() => defaultCols.map((col) => col.id), []);

  const { data: initialTasks } = useGetTasks();
  const { tasks, setTasks, updateColumnIdTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    const { type, task } = event.active.data.current;

    if (type === "Task") {
      setActiveTask(task);
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over, collisions } = event;
    const activeId = active.id as string;

    await updateColumnIdTask(activeId, `${collisions[1].id}`);

    if (!over || activeId === over.id || active.data.current?.type !== "Column") {
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = `${over.id}`;

    if (activeId === overId) {
      return;
    }

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) {
      return;
    }

    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);

      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        setTasks(arrayMove<Task>(tasks, activeIndex, overIndex - 1));
      }

      setTasks(arrayMove<Task>(tasks, activeIndex, overIndex));
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      tasks[activeIndex].columnId = overId;
      setTasks(arrayMove<Task>(tasks, activeIndex, activeIndex));
    }
  }

  return (
    <div className='m-auto flex min-h-screen w-full items-center'>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}>
        <div className='flex gap-6'>
          <SortableContext items={columnsId}>
            {defaultCols.map((column) => (
              <ColumnContainter
                key={column.id}
                column={column}
                tasks={
                  tasks ? tasks.filter(({ columnId }) => columnId === column.id) : []
                }
              />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
