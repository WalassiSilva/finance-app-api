import {
  badRequest,
  invalidAmountResponse,
  invalidIdResponse,
  invalidTypeResponse,
  ok,
  serverError,
  validateAmount,
  validateId,
  validateType,
} from "../helpers/index.js";
export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const isIdValid = validateId(httpRequest.params.transactionId);
      if (!isIdValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;
      const allowedFields = ["name", "amount", "type", "date"];

      const hasInvalidField = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      );

      if (hasInvalidField) {
        return badRequest({ message: "Some provided field is not allowed." });
      }

      if (params.amount) {
        const isAmountValid = validateAmount(params.amount);
        if (!isAmountValid) {
          return invalidAmountResponse();
        }
      }

      if (params.type) {
        const isTypeValid = validateType(params.type);
        if (!isTypeValid) {
          return invalidTypeResponse();
        }
      }

      const transaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      );

      return ok(transaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
