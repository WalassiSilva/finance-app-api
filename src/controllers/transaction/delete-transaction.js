import { badRequest, invalidIdResponse, ok, validateId } from "../helpers";
import { serverError } from "../helpers.js";

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

      return ok(transaction);
    } catch (error) {
      console.error(error);
      serverError();
    }
  }
}
