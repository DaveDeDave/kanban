export default class Board {
  constructor({ ownerId, name }) {
    this.ownerId = ownerId;
    this.name = name;
  }
}

Board.schema = {
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string"
    }
  },
  additionalProperties: false
};
