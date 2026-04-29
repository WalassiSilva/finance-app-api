import {
  IdGeneratorAdapter,
  PasswordHasherAdapter,
} from "../../adapters/index.js";
import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController,
} from "../../controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresGetUserBalanceRepository,
  PostgresGetUserByIdRepository,
  PostgresGetUserByImail,
  PostgresUpdateUserRepository,
} from "../../repositories/postgres/index.js";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserBalanceUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../../use-cases/index.js";

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const gerUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(gerUserByIdUseCase);
  return getUserByIdController;
};
export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByImail();
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);
  return updateUserController;
};

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmail = new PostgresGetUserByImail();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmail,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  );
  const createUserController = new CreateUserController(createUserUseCase);
  return createUserController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);
  return deleteUserController;
};

export const makeGetUserBalanceController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    getUserByIdRepository,
    getUserBalanceRepository,
  );
  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase,
  );
  return getUserBalanceController;
};
