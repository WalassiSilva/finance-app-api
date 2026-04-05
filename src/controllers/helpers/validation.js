export const validateId = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
  badRequest({ message: "The provided id is not valid." });
