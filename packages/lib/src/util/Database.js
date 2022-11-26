class Database {
  constructor(dbName) {
    this.dbName = dbName;
  }

  collection(collectionName) {
    return new Collection(this.dbName, collectionName);
  }
}

class Collection {
  constructor(dbName, collectionName) {
    this.dbName = dbName;
    this.collectionName = collectionName;
  }

  async #execute(operation, data) {
    const payload = {
      db: this.dbName,
      collection: this.collectionName,
      ...data
    };
    const response = await fetch(`http://kanban-mongo-proxy:7000/${operation}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  }

  /**
   * Inserts a single document
   * @param {Object} document - Document to insert
   * @example
   * { example: value }
   * @return The result of the operation
   */
  async insertOne(document) {
    return await this.#execute("insertOne", { document });
  }

  /**
   * Inserts multiple document
   * @param {List<Object>} documents - Documents to insert
   * @example
   * [{ example: value }, { example: value }]
   * @return The result of the operation
   */
  async insertMany(documents) {
    return await this.#execute("insertMany", { documents });
  }

  /**
   * Retrieve a single document
   * @param {Object} query - The query used to retrieve the document
   * @example
   * { example: value }
   * @return The document
   */
  async findOne(query) {
    return await this.#execute("findOne", { query });
  }

  /**
   * Retrieves multiple documents
   * @param {Object} data - The query used to retrieve the documents
   * @example
   * { example: value }
   * @return The documents
   */
  async find(query) {
    return await this.#execute("find", { query });
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
  async updateOne(filter, update) {
    return await this.#execute("updateOne", { filter, update });
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
  async updateMany(filter, update) {
    return await this.#execute("updateMany", { filter, update });
  }

  /**
   * Deletes a document from a collection
   * @param {Object} filter - The filter used to select the document to remove
   * @example
   * { example: value }
   * @return The result of the operation
   */
  async deleteOne(filter) {
    return await this.#execute("deleteOne", { filter });
  }

  /**
   * Deletes multiple documents from a collection
   * @param {Object} filter - The filter used to select the documents to remove
   * @example
   * { example: value }
   * @return The result of the operation
   */
  async deleteMany(filter) {
    return await this.#execute("deleteMany", { filter });
  }
}

export default Database;
