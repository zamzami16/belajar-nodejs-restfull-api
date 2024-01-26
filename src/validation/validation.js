import { ResponseError } from "../error/ResponseError.js";

const validate = (schema, model) => {
  const result = schema.validate(model, {
    abortEarly: false,
  });
  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };
