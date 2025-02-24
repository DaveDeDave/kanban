import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { useState } from "react";

export const useBoardModals = () => {
  const [editBoard, setEditBoard] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);

  const {
    isOpen: createColumnModalIsOpen,
    showModal: showCreateColumnModal,
    hideModal: hideCreateColumnModal
  } = useModal();
  const [editColumn, setEditColumn] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);

  const [createTask, setCreateTask] = useState<{ columnId: string } | null>(null);
  const [editTask, setEditTask] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const showEditBoardModal = (board: { id: string; name: string; description: string }) => {
    setEditBoard(board);
  };

  const hideEditBoardModal = () => {
    setEditBoard(null);
  };

  const showDeleteBoardModal = (boardId: string) => {
    setDeleteBoardId(boardId);
  };

  const hideDeleteBoardModal = () => {
    setDeleteBoardId(null);
  };

  const showEditColumnModal = (column: { id: string; name: string; color: string }) => {
    setEditColumn(column);
  };

  const hideEditColumnModal = () => {
    setEditColumn(null);
  };

  const showDeleteColumnModal = (columnId: string) => {
    setDeleteColumnId(columnId);
  };

  const hideDeleteColumnModal = () => {
    setDeleteColumnId(null);
  };

  const showCreateTaskModal = (task: { columnId: string }) => {
    setCreateTask(task);
  };

  const hideCreateTaskModal = () => {
    setCreateTask(null);
  };

  const showEditTaskModal = (task: { id: string; title: string; description: string }) => {
    setEditTask(task);
  };

  const hideEditTaskModal = () => {
    setEditTask(null);
  };

  const showDeleteTaskModal = (taskId: string) => {
    setDeleteTaskId(taskId);
  };

  const hideDeleteTaskModal = () => {
    setDeleteTaskId(null);
  };

  return {
    editBoard,
    editBoardModalIsOpen: editBoard !== null,
    showEditBoardModal,
    hideEditBoardModal,
    deleteBoardId,
    deleteBoardModalIsOpen: deleteBoardId !== null,
    showDeleteBoardModal,
    hideDeleteBoardModal,
    createColumnModalIsOpen,
    showCreateColumnModal,
    hideCreateColumnModal,
    editColumn,
    editColumnModalIsOpen: editColumn !== null,
    showEditColumnModal,
    hideEditColumnModal,
    deleteColumnId,
    deleteColumnModalIsOpen: deleteColumnId !== null,
    showDeleteColumnModal,
    hideDeleteColumnModal,
    createTask,
    createTaskModalIsOpen: createTask !== null,
    showCreateTaskModal,
    hideCreateTaskModal,
    editTask,
    editTaskModalIsOpen: editTask !== null,
    showEditTaskModal,
    hideEditTaskModal,
    deleteTaskId,
    deleteTaskModalIsOpen: deleteTaskId !== null,
    showDeleteTaskModal,
    hideDeleteTaskModal
  };
};
