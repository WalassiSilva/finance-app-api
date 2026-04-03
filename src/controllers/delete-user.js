import { DeleteUserUseCase } from "../use-cases/index.js";
import {
  ok,
  validateId,
  serverError,
  invalidIdResponse,
} from "./helpers/index.js";
export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = validateId(userId);
      if (!isIdValid) {
        return invalidIdResponse();
      }

      const deleteUserUseCase = new DeleteUserUseCase();
      const deletedUser = deleteUserUseCase.execute(userId);

      return ok(deletedUser);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
