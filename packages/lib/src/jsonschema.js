import { HTTPError } from "./error.js";

const validateSchema = async (schema, content, key) => {
  if (key !== undefined && realTypeOf(content) !== "[object Object]")
    throw new HTTPError({
      code: `error.wrong_format_${key}`,
      status: 400,
      message: `${key} field must be a ${schema.type}`
    });
  if (content === undefined)
    throw new HTTPError({
      code: "error.missing_body",
      status: 400,
      message: "body is missing"
    });
  if (schema.anyOf) {
    const requiredFields = [];
    let satisfied = 0;
    await Promise.all(
      schema.anyOf.map(async ({ required }) => {
        requiredFields.push(required[0]);
        if (content[required[0]] !== undefined) satisfied++;
      })
    );
    if (satisfied === 0)
      throw new HTTPError({
        code: `error.missing_fields`,
        status: 400,
        message: `specify at least one field amoung these: [${requiredFields.join(", ")}]`
      });
  }
  if (schema.required) {
    await Promise.all(
      schema.required.map(async (field) => {
        if (content[field] === undefined)
          throw new HTTPError({
            code: `error.missing_${field}`,
            status: 400,
            message: `${field} field missing`
          });
      })
    );
  }
  await Promise.all(
    Object.keys(content).map(async (key) => {
      const valueSchema = schema.properties[key];
      if (valueSchema !== undefined) {
        if (valueSchema.type == "object") {
          await validateSchema(valueSchema, content[key]);
        } else if (valueSchema.type == "array") {
          await validateSchemaArray(valueSchema, content[key], key);
        } else if (["number", "string", "boolean"].indexOf(valueSchema.type) !== -1) {
          validateSchemaPrimitive(valueSchema, content[key], key);
        }
      } else if (schema.additionalProperties == false) {
        delete content[key];
      }
    })
  );
};

const validateSchemaArray = async (schema, content, key) => {
  if (realTypeOf(content) !== "[object Array]") {
    throw new HTTPError({
      code: `error.wrong_format_${key}`,
      status: 400,
      message: `${key} field must be a ${schema.type}`
    });
  }
  const itemsSchema = schema.items;
  if (itemsSchema.type == "array")
    await Promise.all(
      content.map(async (item) => await validateSchemaArray(itemsSchema, item, key))
    );
  else if (itemsSchema.type == "object")
    await Promise.all(content.map(async (item) => await validateSchema(itemsSchema, item, key)));
  else if (["number", "string", "boolean"].indexOf(itemsSchema.type) !== -1)
    await Promise.all(content.map(async (item) => validateSchemaPrimitive(itemsSchema, item, key)));
};

const validateSchemaPrimitive = (schema, value, key) => {
  if (typeof value !== schema.type)
    throw new HTTPError({
      code: `error.wrong_format_${key}`,
      status: 400,
      message: `${key} field must be a ${schema.type}`
    });
  if (schema.pattern !== undefined && !schema.pattern.test(value)) {
    throw new HTTPError({
      code: `error.wrong_format_${key}`,
      status: 400,
      message: schema.errorPattern
    });
  }
};

const realTypeOf = (variable) => Object.prototype.toString.call(variable);

export { validateSchema };
