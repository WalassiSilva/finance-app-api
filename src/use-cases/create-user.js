import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import {
  PostgresGetUserByImail,
  PostgresCreateUserRepository,
} from "../repositories/postgres/index.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserUseCase {
  async execute(createUserParams) {
    const getUserByEmail = new PostgresGetUserByImail();
    const userEmailExists = await getUserByEmail.execute(
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

    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createdUser = await postgresCreateUserRepository.execute(user);
    return createdUser;
  }
}
