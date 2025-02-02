import { FC } from "react";
import styles from "./kanban-column.module.scss";
import { KanbanColumnHead, KanbanColumnHeadProps } from "@/molecules/kanban-column-head";
import { RiAddCircleLine, RiPencilLine } from "@remixicon/react";
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
            icon: <RiPencilLine />
          },
          {
            onClick: onAddClick,
            icon: <RiAddCircleLine />
          }
        ]}
      />
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <TaskCard key={task.id} id={task.id} title={task.title} description={task.description} />
        ))}
      </div>
    </div>
  );
};
