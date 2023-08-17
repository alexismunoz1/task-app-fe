import { useEffect, useMemo, useState } from "react";
import { Column, Task } from "../lib/types";
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
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const { data: initialTasks } = useGetTasks();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // const { task, setTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type;
    const column = event.active.data.current?.column;
    const task = event.active.data.current?.task;

    if (type === "Column") setActiveColumn(column);
    if (type === "Task") setActiveTask(task);

    return;
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    const activeId = active.id;
    if (!over) return;

    const overId = over.id;
    if (activeId === overId) return;

    const isActiveColumn = active.data.current?.type === "Column";
    if (!isActiveColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((column) => column.id === activeId);
      const overColumnIndex = columns.findIndex((column) => column.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
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
          <DragOverlay>
            {activeColumn && (
              <ColumnContainter
                column={activeColumn}
                tasks={tasks.filter(({ columnId }) => columnId === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
