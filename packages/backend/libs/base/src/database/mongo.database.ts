import * as Realm from "realm-web";
import DevelopDatabase from "./develop.database";

interface MongoHelperInput {
  environment: "Development" | "Production" | "Testing";
  app_name: string;
  api_key: string;
  mongo_proxy_base_url?: string;
}

interface MongoDbDatabaseWithObjectID extends globalThis.Realm.Services.MongoDBDatabase {
  ObjectID: (input: string) => Realm.BSON.ObjectID;
}

class MongoHelper {
  environment: "Development" | "Production" | "Testing";
  app_name: string;
  api_key: string;
  mongo_proxy_base_url?: string;

  constructor(input: MongoHelperInput) {
    this.environment = input.environment;
    this.app_name = input.app_name;
    this.api_key = input.api_key;
    this.mongo_proxy_base_url = input.mongo_proxy_base_url;
  }

  async loginApiKey() {
    const app = new Realm.App({ id: this.app_name });
    const credentials = Realm.Credentials.apiKey(this.api_key);
    return await app.logIn(credentials);
  }

  async getInstance() {
    let db: DevelopDatabase | MongoDbDatabaseWithObjectID;
    const objectID = (input: string) => new Realm.BSON.ObjectID(input);
    if (this.environment == "Production") {
      const user = await this.loginApiKey();
      const client = user.mongoClient("mongodb-atlas");
      db = client.db("kanban") as MongoDbDatabaseWithObjectID;
      db.collection("test").insertOne({ test: { ok: "" } });
    } else {
      db = new DevelopDatabase("kanban", objectID);
      db.mongoProxyBaseUrl = this.mongo_proxy_base_url!;
    }
    db.ObjectID = objectID;
    return db;
  }
}

export const getMongoHelper = async (input: MongoHelperInput) => {
  const mongoHelper = new MongoHelper(input);
  return mongoHelper.getInstance();
};
