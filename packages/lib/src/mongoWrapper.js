import * as Realm from "realm-web";
import Database from "./util/Database.js";

const loginApiKey = async () => {
  const app = new Realm.App({ id: MONGO_APP_NAME });
  const credentials = Realm.Credentials.apiKey(MONGO_API_KEY);
  try {
    return await app.logIn(credentials);
  } catch (e) {
    console.error("Failed to login", err);
  }
};

const getInstance = async () => {
  let db;
  if (ENVIRONMENT == "Production") {
    const user = await loginApiKey();
    const client = user.mongoClient("mongodb-atlas");
    db = client.db("kanban");
  } else {
    db = new Database("kanban");
  }
  db.ObjectID = Realm.BSON.ObjectID;
  return db;
};

const injectClient = (mongo) => async (request) => {
  mongo = mongo || (await getInstance());
  request.mongo = mongo;
};

export { getInstance, injectClient };
