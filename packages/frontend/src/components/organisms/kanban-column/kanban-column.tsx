import { FC } from "react";
import styles from "./kanban-column.module.scss";
import { KanbanColumnHead, KanbanColumnHeadProps } from "@/molecules/kanban-column-head";
import { RiAddCircleLine, RiDeleteBin2Line, RiPencilLine } from "@remixicon/react";
import { TaskCard, TaskCardProps } from "@/molecules/task-card";

export interface KanbanColumnProps {
  head: Omit<KanbanColumnHeadProps, "actions" | "numberOfTasks">;
  tasks: Omit<TaskCardProps, "onEdit" | "onDelete">[];
  onEdit: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  onEditTask: (task: { id: string; title: string; description: string }) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn: FC<KanbanColumnProps> = ({
  head,
  tasks,
  onAddTask,
  onEdit,
  onDelete,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <div className={styles.kanbanColumn}>
      <KanbanColumnHead
        title={head.title}
        color={head.color}
        numberOfTasks={tasks.length}
        actions={[
          {
            onClick: onAddTask,
            icon: <RiAddCircleLine />
          }
        ]}
        settings={[
          {
            label: "Edit",
            onClick: onEdit,
            icon: <RiPencilLine />
          },
          {
            label: "Delete",
            onClick: onDelete,
            icon: <RiDeleteBin2Line />
          }
        ]}
      />
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
