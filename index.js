import "dotenv/config.js";
import express from "express";
import { PostgresHelper } from "./src/db/postgres/helper.js";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from "./src/factories/controllers/user.js";
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetUserTransactionsController,
  makeUpdateTransactionController,
} from "./src/factories/controllers/transaction.js";

const app = express();
app.use(express.json());

app.get("/", async (_, res) => {
  const results = await PostgresHelper.query("SELECT * FROM users;");
  res.send(JSON.stringify(results));
});

app.get("/api/users/:userId/balance", async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();
  const { statusCode, body } = await getUserBalanceController.execute(request);

  response.status(statusCode).send(body);
});

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();

  const { statusCode, body } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserController = makeUpdateUserController();

  const { statusCode, body } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

app.post("/api/users", async (request, response) => {
  const createUserController = makeCreateUserController();

  const { statusCode, body } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserController = makeDeleteUserController();

  const { statusCode, body } = await deleteUserController.execute(request);
  response.status(statusCode).send(body);
});

//------------TRANSACTION-----------------
app.get("/api/transactions", async (request, response) => {
  const getUserTransactions = makeGetUserTransactionsController();
  const { statusCode, body } = await getUserTransactions.execute(request);

  response.status(statusCode).send(body);
});

app.post("/api/transactions", async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } =
    await createTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/api/transactions/:transactionId", async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { statusCode, body } =
    await updateTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.delete("/api/transactions/:transactionId", async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController();

  const { statusCode, body } =
    await deleteTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(`running at http://localhost:${process.env.PORT}`),
);
