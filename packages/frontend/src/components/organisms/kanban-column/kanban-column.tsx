import { FC } from "react";
import styles from "./kanban-column.module.scss";
import { KanbanColumnHead, KanbanColumnHeadProps } from "@/molecules/kanban-column-head";
import { RiAddCircleLine, RiSettings4Line } from "@remixicon/react";
import { TaskCard, TaskCardProps } from "@/molecules/task-card";

export interface KanbanColumnProps {
  head: Omit<KanbanColumnHeadProps, "actions" | "numberOfTasks">;
  tasks: TaskCardProps[];
  onEditClick: () => void;
  onAddClick: () => void;
}

export const KanbanColumn: FC<KanbanColumnProps> = ({ head, tasks, onAddClick, onEditClick }) => {
  return (
    <div className={styles.kanbanColumn}>
      <KanbanColumnHead
        title={head.title}
        color={head.color}
        numberOfTasks={tasks.length}
        actions={[
          {
            onClick: onEditClick,
            icon: <RiSettings4Line />
          },
          {
            onClick: onAddClick,
            icon: <RiAddCircleLine />
          }
        ]}
      />
      {tasks.map((task) => (
        <TaskCard key={task.id} id={task.id} title={task.title} description={task.description} />
      ))}
    </div>
  );
};
