export default async (db, input) => {
  await Promise.all(
    Object.keys(input).map(async (collection) => {
      db.collection(collection).insertMany(input[collection]);
    })
  );
};
