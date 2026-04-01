import bcrypt from "bcrypt";
import { PostgresGetUserByImail } from "../repositories/postgres/get-user-email.js";
import { EmailAlreadyInUseError } from "../errors/user.js";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const getUserByEmailRepository = new PostgresGetUserByImail();
      const userEmailExists = await getUserByEmailRepository.execute(
        updateUserParams.email,
      );

      if (userEmailExists && userEmailExists.id != userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email);
      }
    }
    const user = { ...updateUserParams };

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);
      user.password = hashedPassword;
    }

    const updateUserRepository = new PostgresUpdateUserRepository();
    const updateUser = await updateUserRepository.execute(userId, user);

    return updateUser;
  }
}
