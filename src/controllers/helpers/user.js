import { badRequest } from "./http.js";
import validator from "validator";

export const invalidPasswordResponse = () =>
  badRequest({ message: "Password must have at least 6 characters." });

export const invalidEmailResponse = () =>
  badRequest({ message: "Ivalid e-mail. Please proved a valid one." });

export const invalidIdResponse = () =>
  badRequest({ message: "The provided id is not valid." });

export const validatePassword = (password) => password.length >= 6;

export const validateEmail = (email) => validator.isEmail(email);
