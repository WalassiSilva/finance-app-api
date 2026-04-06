import validator from "validator";
import { badRequest } from "./index.js";

export const validateAmount = (amount) => {
  if (typeof amount !== "number") {
    return false;
  }

  return validator.isCurrency(amount.toFixed(2), {
    digits_after_decimal: [2],
    allow_negatives: false,
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
