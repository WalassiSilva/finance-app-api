import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
  constructor(
    getUserByEmail,
    postgresCreateUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  ) {
    this.postgresCreateUserRepository = postgresCreateUserRepository;
    this.getUserByEmail = getUserByEmail;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }
  async execute(createUserParams) {
    const userEmailExists = await this.getUserByEmail.execute(
      createUserParams.email,
    );

    if (userEmailExists) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }
    // gerar user ID
    const userId = this.idGeneratorAdapter.execute();

    // criptografar a senha
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    // inserir user no banco
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.postgresCreateUserRepository.execute(user);
    return createdUser;
  }
}
