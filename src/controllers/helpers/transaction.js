import { notFound } from "./index.js";

export const invalidTransactionResponse = () =>
  notFound({ message: "Transaction not found." });
