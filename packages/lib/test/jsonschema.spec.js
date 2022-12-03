import test from "ava";
import { validateSchema } from "../src/jsonschema.js";

test("validate correct content - 1", async (t) => {
  const schema = {
    type: "object",
    required: ["one", "two", "three"],
    properties: {
      one: {
        type: "string"
      },
      two: {
        type: "string"
      },
      three: {
        type: "number"
      },
      four: {
        type: "boolean"
      }
    }
  };
  const content = {
    one: "test",
    two: "test",
    three: 123,
    four: true,
    five: "test"
  };
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate correct content - 2", async (t) => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "object",
        properties: {
          three: {
            type: "array",
            items: {
              type: "string"
            }
          },
          four: {
            type: "string"
          },
          five: {
            type: "array",
            items: {
              type: "object",
              properties: {
                six: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {
    one: {
      three: ["test", "test"],
      four: "test",
      five: [{ six: 123 }, { six: 456 }, { six: 789 }]
    },
    two: 123
  };
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate correct content - 3", async (t) => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "string",
        pattern: /^test/,
        errorPattern: "one must match the /^test/ pattern"
      }
    }
  };
  const content = {
    one: "test123"
  };
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate correct content - 4", async (t) => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "object",
        properties: {
          three: {
            type: "array",
            items: {
              type: "string"
            }
          },
          four: {
            type: "string"
          },
          five: {
            type: "array",
            items: {
              type: "object",
              properties: {
                six: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {};
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate correct content - 5", async (t) => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "object",
        properties: {
          three: {
            type: "array",
            items: {
              type: "string"
            }
          },
          four: {
            type: "string"
          },
          five: {
            type: "array",
            items: {
              type: "object",
              properties: {
                six: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {
    one: {
      three: ["test", "test"],
      four: "test"
    }
  };
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate correct content - 6", async (t) => {
  const schema = {
    type: "object",
    required: ["one", "two"],
    properties: {
      one: {
        type: "object",
        properties: {
          three: {
            type: "array",
            items: {
              type: "string"
            }
          },
          four: {
            type: "string"
          },
          five: {
            type: "array",
            items: {
              type: "object",
              properties: {
                six: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {
    one: {},
    two: 4
  };
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate correct content - 7", async (t) => {
  const schema = {
    type: "object",
    anyOf: [{ required: ["one"] }, { required: ["two"] }],
    properties: {
      one: {
        type: "string"
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {
    two: 123
  };
  await t.notThrowsAsync(validateSchema(schema, content));
});

test("validate wrong content - 1", async (t) => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "object",
        properties: {
          three: {
            type: "array",
            items: {
              type: "string"
            }
          },
          four: {
            type: "string"
          },
          five: {
            type: "array",
            items: {
              type: "object",
              properties: {
                six: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      two: {
        type: "number"
      }
    }
  };
  const content = undefined;
  await t.throwsAsync(validateSchema(schema, content));
});

test("validate wrong content - 2", async (t) => {
  const schema = {
    type: "object",
    required: ["one", "two"],
    properties: {
      one: {
        type: "object",
        properties: {
          three: {
            type: "array",
            items: {
              type: "string"
            }
          },
          four: {
            type: "string"
          },
          five: {
            type: "array",
            items: {
              type: "object",
              properties: {
                six: {
                  type: "number"
                }
              }
            }
          }
        }
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {
    one: {}
  };
  await t.throwsAsync(validateSchema(schema, content));
});

test("validate wrong content - 3", async (t) => {
  const schema = {
    type: "object",
    properties: {
      one: {
        type: "string",
        pattern: /^test/,
        errorPattern: "one must match the /^test/ pattern"
      }
    }
  };
  const content = {
    one: "Test123"
  };
  await t.throwsAsync(validateSchema(schema, content));
});

test("validate wrong content - 4", async (t) => {
  const schema = {
    type: "object",
    anyOf: [{ required: ["one"] }, { required: ["two"] }],
    properties: {
      one: {
        type: "string"
      },
      two: {
        type: "number"
      }
    }
  };
  const content = {
    three: 123
  };
  await t.throwsAsync(validateSchema(schema, content));
});

test("check if additionalProperties option works - 1", async (t) => {
  const schema = {
    type: "object",
    required: ["one", "two", "three"],
    properties: {
      one: {
        type: "string"
      },
      two: {
        type: "string"
      },
      three: {
        type: "number"
      },
      four: {
        type: "boolean"
      }
    },
    additionalProperties: false
  };
  const content = {
    one: "test",
    two: "test",
    three: 123,
    four: true,
    five: "test",
    six: 123
  };
  await t.notThrowsAsync(validateSchema(schema, content));
  t.is(content.one, "test");
  t.is(content.five, undefined);
  t.is(content.six, undefined);
});

test("check if additionalProperties option works - 2", async (t) => {
  const schema = {
    type: "object",
    required: ["one", "two", "three"],
    properties: {
      one: {
        type: "string"
      },
      two: {
        type: "string"
      },
      three: {
        type: "number"
      },
      four: {
        type: "boolean"
      }
    },
    additionalProperties: true
  };
  const content = {
    one: "test",
    two: "test",
    three: 123,
    four: true,
    five: "test",
    six: 123
  };
  await t.notThrowsAsync(validateSchema(schema, content));
  t.is(content.one, "test");
  t.is(content.five, "test");
  t.is(content.six, 123);
});

test("check if additionalProperties option works - 3", async (t) => {
  const schema = {
    type: "object",
    required: ["one", "two", "three"],
    properties: {
      one: {
        type: "string"
      },
      two: {
        type: "string"
      },
      three: {
        type: "number"
      },
      four: {
        type: "boolean"
      }
    }
  };
  const content = {
    one: "test",
    two: "test",
    three: 123,
    four: true,
    five: "test",
    six: 123
  };
  await t.notThrowsAsync(validateSchema(schema, content));
  t.is(content.one, "test");
  t.is(content.five, "test");
  t.is(content.six, 123);
});
