import validator from "validator";
import {
  badRequest,
  created,
  invalidIdResponse,
  requiredFieldIsMissingResponse,
  serverError,
  validateId,
  validateRequiredFields,
} from "../helpers/index.js";
import {
  invalidAmountResponse,
  invalidTypeResponse,
  validateAmount,
  validateType,
} from "../helpers/transaction.js";

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
        return requiredFieldIsMissingResponse(missingField);
      }

      const isUserIdValid = validateId(params.user_id);
      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const isAmountValid = validateAmount(params.amount);
      if (!isAmountValid) {
        return invalidAmountResponse();
      }

      const type = params.type.trim().toUpperCase();
      const isTypeValid = validateType(type);

      if (!isTypeValid) {
        return invalidTypeResponse();
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
