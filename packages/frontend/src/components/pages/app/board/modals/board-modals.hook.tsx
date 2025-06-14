import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { useState } from "react";

export const useBoardModals = () => {
  const [editBoard, setEditBoard] = useState<{
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
  const [editColumn, setEditColumn] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [deleteColumn, setDeleteColumn] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [createTask, setCreateTask] = useState<{ columnId: string } | null>(null);
  const [editTask, setEditTask] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteTask, setDeleteTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const showEditBoardModal = (board: { id: string; name: string; description: string }) => {
    setEditBoard(board);
  };

  const hideEditBoardModal = () => {
    setEditBoard(null);
  };

  const showDeleteBoardModal = (board: { id: string; name: string }) => {
    setDeleteBoard(board);
  };

  const hideDeleteBoardModal = () => {
    setDeleteBoard(null);
  };

  const showEditColumnModal = (column: { id: string; name: string; color: string }) => {
    setEditColumn(column);
  };

  const hideEditColumnModal = () => {
    setEditColumn(null);
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

  const showEditTaskModal = (task: { id: string; title: string; description: string }) => {
    setEditTask(task);
  };

  const hideEditTaskModal = () => {
    setEditTask(null);
  };

  const showDeleteTaskModal = (task: { id: string; title: string }) => {
    setDeleteTask(task);
  };

  const hideDeleteTaskModal = () => {
    setDeleteTask(null);
  };

  return {
    editBoard,
    editBoardModalIsOpen: editBoard !== null,
    showEditBoardModal,
    hideEditBoardModal,
    deleteBoard,
    deleteBoardModalIsOpen: deleteBoard !== null,
    showDeleteBoardModal,
    hideDeleteBoardModal,
    createColumnModalIsOpen,
    showCreateColumnModal,
    hideCreateColumnModal,
    editColumn,
    editColumnModalIsOpen: editColumn !== null,
    showEditColumnModal,
    hideEditColumnModal,
    deleteColumn,
    deleteColumnModalIsOpen: deleteColumn !== null,
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
    deleteTask,
    deleteTaskModalIsOpen: deleteTask !== null,
    showDeleteTaskModal,
    hideDeleteTaskModal
  };
};
