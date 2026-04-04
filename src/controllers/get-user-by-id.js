// import { GetUserByIdUseCase } from "../use-cases/index.js";
import {
  invalidIdResponse,
  validateId,
  ok,
  serverError,
  invalidUserResponse,
} from "./helpers/index.js";

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }
  async execute(httpRequest) {
    try {
      const isIdValid = validateId(httpRequest.params.userId);
      if (!isIdValid) return invalidIdResponse();

      const user = await this.getUserByIdUseCase.execute(
        httpRequest.params.userId,
      );

      if (!user) {
        return invalidUserResponse();
      }

      return ok(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
