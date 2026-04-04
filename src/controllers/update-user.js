import { EmailAlreadyInUseError } from "../errors/user.js";
import {
  invalidEmailResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  validateEmail,
  validateId,
  validatePassword,
  badRequest,
  ok,
  serverError,
} from "./helpers/index.js";

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
      const allowedFields = ["first_name", "last_name", "email", "password"];

      const hasInvalidField = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      );

      if (hasInvalidField) {
        return badRequest({ message: "Some provided field is not allowed." });
      }

      if (params.password) {
        const isPasswordvalid = validatePassword(params.password);
        if (!isPasswordvalid) {
          return invalidPasswordResponse();
        }
      }

      if (params.email) {
        const isEmailValid = validateEmail(params.email);
        if (!isEmailValid) {
          return invalidEmailResponse();
        }
      }

      const updateUser = await this.updateUserUseCase.execute(userId, params);

      return ok(updateUser);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      console.error(error);
      return serverError();
    }
  }
}
