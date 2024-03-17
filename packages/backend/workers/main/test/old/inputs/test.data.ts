import { PrismaClient } from "@prisma/client";

export const loadTestData = async (prisma: PrismaClient) => {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        email: "test@test.it",
        hashedPassword: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO" // Password12.
      },
      {
        id: 2,
        email: "test2@test.it",
        hashedPassword: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO" // Password12.
      }
    ]
  });

  await prisma.board.createMany({
    data: [
      {
        id: 1,
        name: "Board 1",
        ownerId: 1
      },
      {
        id: 2,
        name: "Board 2",
        ownerId: 1
      },
      {
        id: 3,
        name: "Board 3",
        ownerId: 2
      }
    ]
  });

  await prisma.column.createMany({
    data: [
      {
        name: "Column 1",
        color: "#ffffff",
        boardId: 1
      },
      {
        name: "Column 2",
        color: "#ffffff",
        boardId: 1
      },
      {
        name: "Column 3",
        color: "#ffffff",
        boardId: 2
      }
    ]
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Task 1",
        description: "Task 1 description",
        columnId: 1
      },
      {
        title: "Task 2",
        description: "Task 2 description",
        columnId: 1
      },
      {
        title: "Task 3",
        description: "Task 3 description",
        columnId: 3
      }
    ]
  });

  await prisma.subtask.createMany({
    data: [
      {
        description: "Subtask 1 description",
        taskId: 1
      },
      {
        description: "Subtask 2 description",
        taskId: 1
      },
      {
        description: "Subtask 3 description",
        taskId: 3
      }
    ]
  });
};

export const deleteTestData = async (prisma: PrismaClient) => {
  await prisma.user.deleteMany();
};
