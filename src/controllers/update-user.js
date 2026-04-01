import validator from "validator";
import { badRequest, ok, serverError } from "./helpers.js";
import { UpdateUserUseCase } from "../use-cases/udpate-user.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = validator.isUUID(userId);

      if (!isIdValid) {
        return badRequest({ message: "The provided id is not valid." });
      }
      const updateUserParams = httpRequest.body;
      const allowedFields = ["first_name", "last_name", "email", "password"];

      const hasInvalidField = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      );

      if (hasInvalidField) {
        return badRequest({ message: "Some provided field is not allowed." });
      }

      if (updateUserParams.password) {
        const isPasswordInvalid = updateUserParams.password.length < 6;
        if (isPasswordInvalid) {
          return badRequest({
            message: "Password must be at least 6 characters.",
          });
        }
      }

      if (updateUserParams.email) {
        const isEmailValid = validator.isEmail(updateUserParams.email);
        if (!isEmailValid) {
          return badRequest({
            message: "Invalid e-mail. Please provide a valid one.",
          });
        }
      }

      const updateUserUseCase = new UpdateUserUseCase();
      const updateUser = await updateUserUseCase.execute(
        userId,
        updateUserParams,
      );

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
