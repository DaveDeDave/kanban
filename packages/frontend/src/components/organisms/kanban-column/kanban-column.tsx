import { FC, Ref } from "react";
import styles from "./kanban-column.module.scss";
import { KanbanColumnHead, KanbanColumnHeadProps } from "@/molecules/kanban-column-head";
import { RiAddCircleLine, RiDeleteBin2Line, RiPencilLine } from "@remixicon/react";
import { TaskCard, TaskCardProps } from "@/molecules/task-card";
import { t } from "i18next";

export interface KanbanColumnProps {
  head: Omit<KanbanColumnHeadProps, "actions" | "numberOfTasks">;
  tasks: Omit<TaskCardProps, "onUpdate" | "onDelete">[];
  taskListRef?: Ref<HTMLDivElement>;
  headClassName?: string;
  id?: string;
  onUpdate: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  onUpdateTask: (task: { id: string; title: string; description: string }) => void;
  onDeleteTask: (task: { id: string; title: string }) => void;
}

export const KanbanColumn: FC<KanbanColumnProps> = ({
  head,
  tasks,
  taskListRef,
  headClassName,
  id,
  onAddTask,
  onUpdate,
  onDelete,
  onUpdateTask,
  onDeleteTask
}) => {
  return (
    <div className={styles.kanbanColumn}>
      <KanbanColumnHead
        dragClassname={headClassName}
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
            label: t("general.label.update"),
            onClick: onUpdate,
            icon: <RiPencilLine />
          },
          {
            label: t("general.label.delete"),
            onClick: onDelete,
            destructive: true,
            icon: <RiDeleteBin2Line />
          }
        ]}
      />
      <div className={styles.tasks} id={id} ref={taskListRef}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
