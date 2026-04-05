import validator from "validator";
import { badRequest } from "./index.js";

export const validateAmount = (amount) => {
  return validator.isCurrency(amount.toString(), {
    digits_after_decimal: [2],
    allow_decimal: false,
    decimal_separator: ".",
  });
};

export const validateType = (type) => {
  return ["INCOME", "EXPENSE", "INVESTMENT"].includes(type);
};

export const invalidTypeResponse = () => {
  return badRequest({
    message: "The type must be INCOME, EXPENSE, INVESTMENT.",
  });
};

export const invalidAmountResponse = () => {
  return badRequest({ message: "The amount must be a valid currency." });
};
