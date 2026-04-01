import { CreateUserUseCase } from "../use-cases/create-user.js";
import validator from "validator";
import { badRequest, created, serverError } from "./helpers.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      //validar request (required fields, tamanho da senha e email)
      const requiredFields = ["first_name", "last_name", "email", "password"];

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return {
            statusCode: 400,
            body: {
              errorMessage: `Missing param: ${field}`,
            },
          };
        }
      }

      // validar senha
      const isPasswordValid = params.password.length < 6;
      if (isPasswordValid) {
        return badRequest({
          message: "Password must be at least 6 charecters.",
        });
      }
      //validar senha
      const isEmailValid = validator.isEmail(params.email);
      if (!isEmailValid) {
        return badRequest({
          message: "Invalid e-mail. Please provide a valid one.",
        });
      }

      // chamar use case
      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);
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
