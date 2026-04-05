import validator from "validator";

export const validateId = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
  badRequest({ message: "The provided id is not valid." });

export const isString = (value) => typeof value === "string";

export const validateRequiredFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const isFieldMissing = !params[field];
    const isFieldEmpty =
      isString(params[field]) &&
      validator.isEmpty(params[field], { ignore_whitespace: true });
    if (isFieldMissing || isFieldEmpty) {
      return {
        missingField: field,
        validationSuccess: false,
      };
    }
  }
  return {
    missingField: undefined,
    validationSuccess: true,
  };
};
