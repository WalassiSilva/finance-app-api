import validator from "validator";
import {
  badRequest,
  created,
  invalidIdResponse,
  serverError,
  validateId,
  validateRequiredFields,
} from "../helpers/index.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ["user_id", "name", "amount", "date", "type"];

      const { missingField, validationSuccess } = validateRequiredFields(
        params,
        requiredFields,
      );

      if (!validationSuccess) {
        return badRequest({ message: `The field ${missingField} is missing` });
      }

      const isUserIdValid = validateId(params.user_id);
      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      if (params.amount <= 0) {
        return badRequest({
          message: "The amount must be greatter than 0.",
        });
      }
      const isAmountValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: ".",
      });
      if (!isAmountValid) {
        return badRequest({ message: "The amount must be a valid currency." });
      }

      const type = params.type.trim().toUpperCase();
      const isTypeValid = ["INCOME", "EXPENSE", "INVESTMENT"].includes(type);
      if (!isTypeValid) {
        badRequest({ message: "The must be INCOME, EXPENSE or INVESTMENT." });
      }
      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      });
      return created(transaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
