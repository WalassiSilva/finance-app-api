import { badRequest, notFound } from "./index.js";

export const invalidPasswordResponse = () =>
  badRequest({ message: "Password must have at least 6 characters." });

export const invalidEmailResponse = () =>
  badRequest({ message: "Ivalid e-mail. Please proved a valid one." });

export const invalidUserResponse = () =>
  notFound({ message: "User not found." });
