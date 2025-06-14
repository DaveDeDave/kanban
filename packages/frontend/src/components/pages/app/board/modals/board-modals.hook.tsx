import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { useState } from "react";

export const useBoardModals = () => {
  const [updateBoard, setUpdateBoard] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [deleteBoard, setDeleteBoard] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    isOpen: createColumnModalIsOpen,
    showModal: showCreateColumnModal,
    hideModal: hideCreateColumnModal
  } = useModal();
  const [updateColumn, setUpdateColumn] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [deleteColumn, setDeleteColumn] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [createTask, setCreateTask] = useState<{ columnId: string } | null>(null);
  const [updateTask, setUpdateTask] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTask, setDeleteTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const showUpdateBoardModal = (board: { id: string; name: string; description: string }) => {
    setUpdateBoard(board);
  };

  const hideUpdateBoardModal = () => {
    setUpdateBoard(null);
  };

  const showDeleteBoardModal = (board: { id: string; name: string }) => {
    setDeleteBoard(board);
  };

  const hideDeleteBoardModal = () => {
    setDeleteBoard(null);
  };

  const showUpdateColumnModal = (column: { id: string; name: string; color: string }) => {
    setUpdateColumn(column);
  };

  const hideUpdateColumnModal = () => {
    setUpdateColumn(null);
  };

  const showDeleteColumnModal = (column: { id: string; name: string }) => {
    setDeleteColumn(column);
  };

  const hideDeleteColumnModal = () => {
    setDeleteColumn(null);
  };

  const showCreateTaskModal = (task: { columnId: string }) => {
    setCreateTask(task);
  };

  const hideCreateTaskModal = () => {
    setCreateTask(null);
  };

  const showUpdateTaskModal = (task: { id: string; title: string; description: string }) => {
    setUpdateTask(task);
  };

  const hideUpdateTaskModal = () => {
    setUpdateTask(null);
  };

  const showDeleteTaskModal = (task: { id: string; title: string }) => {
    setDeleteTask(task);
  };

  const hideDeleteTaskModal = () => {
    setDeleteTask(null);
  };

  return {
    updateBoard,
    updateBoardModalIsOpen: updateBoard !== null,
    showUpdateBoardModal,
    hideUpdateBoardModal,
    deleteBoard,
    deleteBoardModalIsOpen: deleteBoard !== null,
    showDeleteBoardModal,
    hideDeleteBoardModal,
    createColumnModalIsOpen,
    showCreateColumnModal,
    hideCreateColumnModal,
    updateColumn,
    updateColumnModalIsOpen: updateColumn !== null,
    showUpdateColumnModal,
    hideUpdateColumnModal,
    deleteColumn,
    deleteColumnModalIsOpen: deleteColumn !== null,
    showDeleteColumnModal,
    hideDeleteColumnModal,
    createTask,
    createTaskModalIsOpen: createTask !== null,
    showCreateTaskModal,
    hideCreateTaskModal,
    updateTask,
    updateTaskModalIsOpen: updateTask !== null,
    showUpdateTaskModal,
    hideUpdateTaskModal,
    deleteTask,
    deleteTaskModalIsOpen: deleteTask !== null,
    showDeleteTaskModal,
    hideDeleteTaskModal
  };
};
