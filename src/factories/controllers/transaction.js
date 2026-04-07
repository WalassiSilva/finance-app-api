import {
  PostgresCreateTransactionRepository,
  PostgresGetUserByIdRepository,
  PostgresGetUserTransactionsRepository,
  PostgresUpdateTransactionRepository,
} from "../../repositories/postgres/index.js";
import {
  CreateTransactionUseCase,
  GetUserTransactionsUseCase,
  UpdateTransactionUseCase,
} from "../../use-cases/index.js";
import {
  CreateTransactionController,
  GetUserTransactionsController,
  UpdateTransactionController,
} from "../../controllers/index.js";

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(
    getUserByIdRepository,
    createTransactionRepository,
  );
  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  );

  return createTransactionController;
};
export const makeGetUserTransactionsController = () => {
  const getUserTransactionsRepository =
    new PostgresGetUserTransactionsRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getUserTransactionsUseCase = new GetUserTransactionsUseCase(
    getUserByIdRepository,
    getUserTransactionsRepository,
  );
  const getUserTransactionsController = new GetUserTransactionsController(
    getUserTransactionsUseCase,
  );
  return getUserTransactionsController;
};

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  );
  return updateTransactionController;
};
