import { EmailAlreadyInUseError } from "../../errors/user.js";
import { badRequest, created, serverError } from "../helpers/index.js";
import { createUserSchema } from "../../schemas/index.js";
import { ZodError } from "zod";

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      //validar request (required fields, tamanho da senha e email)

      await createUserSchema.parseAsync(params);

      // chamar use case
      const createdUser = await this.createUserUseCase.execute(params);
      // retornar a resposta para usuario
      return created(createdUser);
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
