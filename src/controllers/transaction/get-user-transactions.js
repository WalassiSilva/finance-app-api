import { UserNotFoundError } from "../../errors/user.js";
import {
  serverError,
  invalidUserResponse,
  requiredFieldIsMissingResponse,
  validateId,
  invalidIdResponse,
  ok,
} from "../../controllers/helpers/index.js";

export class GetUserTransactionsController {
  constructor(getUserTransactionsUseCase) {
    this.getUserTransactionsUseCase = getUserTransactionsUseCase;
  }
  async execute(httpsRequest) {
    try {
      const userId = httpsRequest.query.userId;
      if (!userId) {
        return requiredFieldIsMissingResponse("userId");
      }

      const isUserIdValid = validateId(userId);
      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const transactions =
        await this.getUserTransactionsUseCase.execute(userId);

      return ok(transactions);
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundError) {
        return invalidUserResponse();
      }
      return serverError();
    }
  }
}
