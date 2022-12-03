import { regex } from "@kanban/lib";

export default class User {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

User.schema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      pattern: regex.email,
      errorPattern: "email field must be email format"
    },
    password: {
      type: "string",
      pattern: regex.password,
      errorPattern:
        "password field must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number and a symbol among these: !\"#$%'()*+,-./"
    }
  },
  additionalProperties: false
};
