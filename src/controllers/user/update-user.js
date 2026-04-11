import { ZodError } from "zod";
import { EmailAlreadyInUseError } from "../../errors/user.js";
import {
  invalidIdResponse,
  validateId,
  badRequest,
  ok,
  serverError,
} from "../helpers/index.js";
import { updateUserSchema } from "../../schemas/user.js";

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = validateId(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }
      const params = httpRequest.body;

      await updateUserSchema.parseAsync(params);

      const updateUser = await this.updateUserUseCase.execute(userId, params);

      if (!updateUser) {
        return invalidIdResponse();
      }

      return ok(updateUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      console.error(error);
      return serverError();
    }
  }
}
