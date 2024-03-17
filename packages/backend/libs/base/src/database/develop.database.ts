import * as Realm from "realm-web";

interface ICollection {
  execute: (operation: MongoOperation, data: Record<string, any>) => Record<string, any>;
  insertOne: (document: Record<string, any>) => Record<string, any>;
  insertMany: (documents: Record<string, any>[]) => Record<string, any>;
  findOne: (query: Record<string, any>, options?: Record<string, any>) => Record<string, any>;
  find: (query: Record<string, any>, options?: Record<string, any>) => Record<string, any>;
  updateOne: (filter: Record<string, any>, update: Record<string, any>) => Record<string, any>;
  updateMany: (filter: Record<string, any>, update: Record<string, any>) => Record<string, any>;
  deleteOne: (filter: Record<string, any>) => Record<string, any>;
  deleteMany: (filter: Record<string, any>) => Record<string, any>;
}

export interface IDevelopDatabase {
  dbName: string;
  ObjectID: (input: string) => Realm.BSON.ObjectID;
  collection: (collectionName: string) => ICollection;
}

class DevelopDatabase implements IDevelopDatabase {
  dbName: string;
  ObjectID: (input: string) => Realm.BSON.ObjectID;
  mongoProxyBaseUrl: string = "";

  constructor(dbName: string, objectID: (input: string) => Realm.BSON.ObjectID) {
    this.dbName = dbName;
    this.ObjectID = objectID;
  }

  collection(collectionName: string) {
    return new Collection(this.dbName, collectionName, this.mongoProxyBaseUrl);
  }
}

type MongoOperation =
  | "insertOne"
  | "insertMany"
  | "findOne"
  | "find"
  | "updateOne"
  | "updateMany"
  | "deleteOne"
  | "deleteMany";

class Collection implements ICollection {
  dbName: string;
  collectionName: string;
  #mongoProxyBaseUrl: string;

  constructor(dbName: string, collectionName: string, mongoProxyBaseUrl: string) {
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.#mongoProxyBaseUrl = mongoProxyBaseUrl;
  }

  async execute(operation: MongoOperation, data: object) {
    const payload = {
      db: this.dbName,
      collection: this.collectionName,
      ...data
    };
    const response = await fetch(`${this.#mongoProxyBaseUrl}/${operation}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const body: Record<string, any> = await response.json();
    if (response.status != 200) {
      if (body.name == "MongoServerError") throw new MongoServerError(body.message, body);
      else throw new Error("BrokenProxy");
    }
    return body;
  }

  /**
   * Inserts a single document
   * @param {Object} document - Document to insert
   * @example
   * { example: value }
   * @return The result of the operation
   */
  async insertOne(document: Record<string, any>) {
    return await this.execute("insertOne", { document });
  }

  /**
   * Inserts multiple document
   * @param {List<Object>} documents - Documents to insert
   * @example
   * [{ example: value }, { example: value }]
   * @return The result of the operation
   */
  async insertMany(documents: Record<string, any>[]) {
    return await this.execute("insertMany", { documents });
  }

  /**
   * Retrieve a single document
   * @param {Object} query - The query used to retrieve the document
   * @param {Object} options - Specifies additional options for the query
   * @example
   * { example: value }
   * @return The document
   */
  async findOne(query: Record<string, any>, options = {}) {
    return await this.execute("findOne", { query, options });
  }

  /**
   * Retrieves multiple documents
   * @param {Object} data - The query used to retrieve the documents
   * @param {Object} options - Specifies additional options for the query
   * @example
   * { example: value }
   * @return The documents
   */
  async find(query: Record<string, any>, options = {}) {
    return await this.execute("find", { query, options });
  }

  /**
   * Updates a single document in a collection
   * @param {Object} filter - The filter used to select the document to update
   * @example
   * { example: value }
   * @param {Object} update - The update operations to be applied to the document
   * @example
   * { example: newValue }
   * @return The result of the operation
   */
  async updateOne(filter: Record<string, any>, update: Record<string, any>) {
    return await this.execute("updateOne", { filter, update });
  }

  /**
   * Updates multiple documents in a collection
   * @param {Object} filter - The filter used to select the documents to update
   * @example
   * { example: value }
   * @param {Object} update - The update operations to be applied to the documents
   * @example
   * { example: newValue }
   * @return The result of the operation
   */
  async updateMany(filter: Record<string, any>, update: Record<string, any>) {
    return await this.execute("updateMany", { filter, update });
  }

  /**
   * Deletes a document from a collection
   * @param {Object} filter - The filter used to select the document to remove
   * @example
   * { example: value }
   * @return The result of the operation
   */
  async deleteOne(filter: Record<string, any>) {
    return await this.execute("deleteOne", { filter });
  }

  /**
   * Deletes multiple documents from a collection
   * @param {Object} filter - The filter used to select the documents to remove
   * @example
   * { example: value }
   * @return The result of the operation
   */
  async deleteMany(filter: Record<string, any>) {
    return await this.execute("deleteMany", { filter });
  }
}

class MongoServerError extends Error {
  constructor(message: string, content: Record<string, any>) {
    super(message);
    this.name = "MongoServerError";
    // @ts-ignore
    Object.keys(content).forEach((key) => (this[key] = content[key]));
  }
}

export default DevelopDatabase;
