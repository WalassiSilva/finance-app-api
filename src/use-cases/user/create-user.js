import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
  constructor(getUserByEmail, postgresCreateUserRepository) {
    this.postgresCreateUserRepository = postgresCreateUserRepository;
    this.getUserByEmail = getUserByEmail;
  }
  async execute(createUserParams) {
    const userEmailExists = await this.getUserByEmail.execute(
      createUserParams.email,
    );

    if (userEmailExists) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }
    // gerar user ID
    const userId = uuidv4();

    // criptografar a senha
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

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
