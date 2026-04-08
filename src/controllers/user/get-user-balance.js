import { UserNotFoundError } from "../../errors/user.js";
import {
  invalidIdResponse,
  ok,
  validateId,
  serverError,
  invalidUserResponse,
} from "../helpers/index.js";
export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = await httpRequest.params.userId;

      const isIdValid = validateId(userId);
      if (!isIdValid) {
        return invalidIdResponse();
      }
      const balance = await this.getUserBalanceUseCase.execute({ userId });

      return ok(balance);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return invalidUserResponse();
      }
      console.error(error);
      serverError();
    }
  }
}
