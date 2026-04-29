import { EmailAlreadyInUseError } from "../../errors/user.js";

export class UpdateUserUseCase {
  constructor(
    getUserByEmailRepository,
    updateUserRepository,
    passwordHasherAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.updateUserRepository = updateUserRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
  }
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const userEmailExists = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      );

      if (userEmailExists && userEmailExists.id != userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email);
      }
    }
    const user = { ...updateUserParams };

    if (updateUserParams.password) {
      const hashedPassword = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
        10,
      );
      user.password = hashedPassword;
    }

    const updateUser = await this.updateUserRepository.execute(userId, user);

    return updateUser;
  }
}
