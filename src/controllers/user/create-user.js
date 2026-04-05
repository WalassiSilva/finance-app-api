import { EmailAlreadyInUseError } from "../../errors/user.js";
import {
  invalidEmailResponse,
  invalidPasswordResponse,
  validateEmail,
  badRequest,
  created,
  serverError,
  validatePassword,
  validateRequiredFields,
  requiredFieldIsMissingResponse,
} from "../helpers/index.js";

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      //validar request (required fields, tamanho da senha e email)
      const requiredFields = ["first_name", "last_name", "email", "password"];

      const { missingField, validationSuccess } = validateRequiredFields(
        params,
        requiredFields,
      );

      if (!validationSuccess) {
        return requiredFieldIsMissingResponse(missingField);
      }

      // validar senha
      const isPasswordValid = validatePassword(params.password);
      if (!isPasswordValid) {
        return invalidPasswordResponse();
      }
      //validar senha
      const isEmailValid = validateEmail(params.email);
      if (!isEmailValid) {
        return invalidEmailResponse();
      }

      // chamar use case
      const createdUser = await this.createUserUseCase.execute(params);
      // retornar a resposta para usuario
      return created(createdUser);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      console.error(error);
      return serverError();
    }
  }
}
