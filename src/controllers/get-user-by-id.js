import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { notFound, ok, serverError } from "./helpers/http.js";
import { invalidIdResponse, validateId } from "./helpers/user.js";

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validateId(httpRequest.params.userId);
      if (!isIdValid) return invalidIdResponse();

      const getUserByIdUseCase = new GetUserByIdUseCase();
      const user = await getUserByIdUseCase.execute(httpRequest.params.userId);

      if (!user) {
        return notFound({ message: "User not Found" });
      }

      return ok(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
