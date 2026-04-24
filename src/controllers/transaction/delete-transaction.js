import {
  invalidIdResponse,
  ok,
  validateId,
  serverError,
  invalidTransactionResponse,
} from "../helpers/index.js";

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const isIdValid = validateId(httpRequest.params.transactionId);
      if (!isIdValid) {
        return invalidIdResponse();
      }

      const transaction = await this.deleteTransactionUseCase.execute(
        httpRequest.params.transactionId,
      );

      if (!transaction) {
        return invalidTransactionResponse();
      }
      return ok(transaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
