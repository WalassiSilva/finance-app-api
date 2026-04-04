import "dotenv/config.js";
import express from "express";
import { PostgresHelper } from "./src/db/postgres/helper.js";
import {
  UpdateUserController,
  GetUserByIdController,
  CreateUserController,
  DeleteUserController,
} from "./src/controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresGetUserByIdRepository,
  PostgresGetUserByImail,
} from "./src/repositories/postgres/index.js";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "./src/use-cases/index.js";
import { PostgresUpdateUserRepository } from "./src/repositories/postgres/index.js";

const app = express();
app.use(express.json());

app.get("/", async (_, res) => {
  const results = await PostgresHelper.query("SELECT * FROM users;");
  res.send(JSON.stringify(results));
});

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const gerUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(gerUserByIdUseCase);

  const { statusCode, body } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByImail();
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);

  const { statusCode, body } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

app.post("/api/users", async (request, response) => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmail = new PostgresGetUserByImail();
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmail,
    createUserRepository,
  );
  const createUserController = new CreateUserController(createUserUseCase);

  const { statusCode, body } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  const { statusCode, body } = await deleteUserController.execute(request);
  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(`running at http://localhost:${process.env.PORT}`),
);
