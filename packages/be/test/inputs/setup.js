const load = async (db, input) => {
  await Promise.all(
    Object.keys(input).map(async (collection) => {
      db.collection(collection).insertMany(input[collection]);
    })
  );
};

const truncate = async (db) => {
  await db.collection("user").deleteMany({});
  await db.collection("board").deleteMany({});
  await db.collection("column").deleteMany({});
  await db.collection("task").deleteMany({});
  await db.collection("subtask").deleteMany({});
};

export { load, truncate };
