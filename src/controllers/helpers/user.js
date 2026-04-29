import { notFound } from "./index.js";

export const invalidUserResponse = () =>
  notFound({ message: "User not found." });
