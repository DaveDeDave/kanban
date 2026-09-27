import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { LexoRank } from "lexorank";
import { Pool } from "pg";
import { boards, columns, subtasks, tasks, users } from "../src/db/tables/index";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const pool = new Pool({ connectionString });
const db = drizzle(pool);

const demoUserId = "b10e0000-0000-4000-8000-000000000001";
const demoBoardId = "b10e0000-0000-4000-8000-000000000002";
const columnIds = [
  "b10e0000-0000-4000-8000-000000000003",
  "b10e0000-0000-4000-8000-000000000004",
  "b10e0000-0000-4000-8000-000000000005"
];
const taskIds = [
  "b10e0000-0000-4000-8000-000000000006",
  "b10e0000-0000-4000-8000-000000000007",
  "b10e0000-0000-4000-8000-000000000008"
];

async function seed() {
  const firstRank = LexoRank.middle();
  const secondRank = firstRank.genNext();
  const thirdRank = secondRank.genNext();

  await db.transaction(async (tx) => {
    await tx
      .insert(users)
      .values({
        id: demoUserId,
        email: "demo@kanban.local",
        // Demo password: Password12.
        hashedPassword: "$2a$10$uy/s.pVavzI01Qm9HVZnvueTPXgQUBtuk8LRz5kMMGs.y5/IVdOQO"
      })
      .onConflictDoNothing();

    await tx
      .insert(boards)
      .values({
        id: demoBoardId,
        name: "Demo board",
        description: "A sample board to explore Kanban",
        ownerId: demoUserId
      })
      .onConflictDoNothing();

    await tx
      .insert(columns)
      .values([
        {
          id: columnIds[0],
          name: "To do",
          color: "#ef4444",
          boardId: demoBoardId,
          rank: firstRank.toString()
        },
        {
          id: columnIds[1],
          name: "In progress",
          color: "#f59e0b",
          boardId: demoBoardId,
          rank: secondRank.toString()
        },
        {
          id: columnIds[2],
          name: "Done",
          color: "#22c55e",
          boardId: demoBoardId,
          rank: thirdRank.toString()
        }
      ])
      .onConflictDoNothing();

    await tx
      .insert(tasks)
      .values([
        {
          id: taskIds[0],
          title: "Plan the project",
          description: "Define the first milestones",
          columnId: columnIds[0],
          rank: firstRank.toString()
        },
        {
          id: taskIds[1],
          title: "Build the board",
          description: "Create the main board view",
          columnId: columnIds[1],
          rank: firstRank.toString()
        },
        {
          id: taskIds[2],
          title: "Set up the repository",
          description: "Prepare the project structure",
          columnId: columnIds[2],
          rank: firstRank.toString()
        }
      ])
      .onConflictDoNothing();

    await tx
      .insert(subtasks)
      .values([
        {
          id: "b10e0000-0000-4000-8000-000000000009",
          taskId: taskIds[0],
          description: "List requirements"
        },
        {
          id: "b10e0000-0000-4000-8000-000000000010",
          taskId: taskIds[0],
          description: "Set priorities"
        },
        {
          id: "b10e0000-0000-4000-8000-000000000011",
          taskId: taskIds[2],
          description: "Initialize the workspace",
          completed: true
        }
      ])
      .onConflictDoNothing();
  });

  console.log("Demo data seeded (demo@kanban.local / Password12.)");
}

async function clear() {
  await db.transaction(async (tx) => {
    await tx.delete(subtasks);
    await tx.delete(tasks);
    await tx.delete(columns);
    await tx.delete(boards);
    await tx.delete(users);
  });

  console.log("Application tables cleared");
}

try {
  if (process.argv[2] === "seed") await seed();
  else if (process.argv[2] === "clear") await clear();
  else throw new Error("Usage: db.ts <seed|clear>");
} finally {
  await pool.end();
}
