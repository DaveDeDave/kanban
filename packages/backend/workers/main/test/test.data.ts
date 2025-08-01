import { PrismaClient } from "@prisma/client";

const testDate = new Date();

export const testData = {
  users: [
    {
      id: "1",
      email: "test@test.it",
      hashedPassword: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO",
      plainPassword: "Password12.",
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6InRlc3RAdGVzdC5pdCIsImlhdCI6MTcxMTc3NDc4OH0.G_BFallDwV3C6Z0PdHmOkfjoyMjpRA6Ynk4TbEAqtCY",
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "2",
      email: "test2@test.it",
      hashedPassword: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO",
      plainPassword: "Password12.",
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjIiLCJlbWFpbCI6InRlc3QyQHRlc3QuaXQiLCJpYXQiOjE3MTE3NzQ3ODh9.2NzhJ8_yzUs6TGkznKyxRBBU7TG32oP1HMSXP1Y1hvU",
      createdAt: testDate,
      updatedAt: testDate
    }
  ],
  boards: [
    {
      id: "1",
      name: "Board 1",
      description: "description 1",
      ownerId: "1",
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "2",
      name: "Board 2",
      description: "description 2",
      ownerId: "1",
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "3",
      name: "Board 3",
      description: "description 3",
      ownerId: "2",
      createdAt: testDate,
      updatedAt: testDate
    }
  ],
  columns: [
    {
      id: "1",
      name: "Column 1",
      color: "#ffffff",
      boardId: "1",
      order: null,
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "2",
      name: "Column 2",
      color: "#ffffff",
      boardId: "1",
      order: null,
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "3",
      name: "Column 3",
      color: "#ffffff",
      boardId: "3",
      order: null,
      createdAt: testDate,
      updatedAt: testDate
    }
  ],
  tasks: [
    {
      id: "1",
      title: "Task 1",
      description: "Task 1 description",
      columnId: "1",
      order: null,
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "2",
      title: "Task 2",
      description: "Task 2 description",
      columnId: "1",
      order: null,
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "3",
      title: "Task 3",
      description: "Task 3 description",
      columnId: "3",
      order: null,
      createdAt: testDate,
      updatedAt: testDate
    }
  ],
  subtasks: [
    {
      id: "1",
      description: "Subtask 1 description",
      taskId: "1",
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "2",
      description: "Subtask 2 description",
      taskId: "1",
      createdAt: testDate,
      updatedAt: testDate
    },
    {
      id: "3",
      description: "Subtask 3 description",
      taskId: "3",
      createdAt: testDate,
      updatedAt: testDate
    }
  ]
};

export const loadTestData = async (prisma: PrismaClient) => {
  await prisma.user.createMany({
    data: testData.users.map(({ id, email, hashedPassword }) => ({ id, email, hashedPassword }))
  });

  await prisma.board.createMany({
    data: testData.boards
  });

  await prisma.column.createMany({
    data: testData.columns
  });

  await prisma.task.createMany({
    data: testData.tasks
  });

  await prisma.subtask.createMany({
    data: testData.subtasks
  });
};

export const deleteTestData = async (prisma: PrismaClient) => {
  await prisma.user.deleteMany();
};
