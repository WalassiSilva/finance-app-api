import "dotenv/config.js";
import express from "express";
import { PostgresHelper } from "./src/db/postgres/helper.js";
import {
  UpdateUserController,
  GetUserByIdController,
  CreateUserController,
  DeleteUserController,
} from "./src/controllers/index.js";

const app = express();
app.use(express.json());

app.get("/", async (_, res) => {
  const results = await PostgresHelper.query("SELECT * FROM users;");
  res.send(JSON.stringify(results));
});

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdController = new GetUserByIdController();
  const { statusCode, body } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserController = new UpdateUserController();
  const { statusCode, body } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

app.post("/api/users", async (request, response) => {
  const createUserController = new CreateUserController();
  const { statusCode, body } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserController = new DeleteUserController();
  const { statusCode, body } = await deleteUserController.execute(request);

  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log(`running at http://localhost:${process.env.PORT}`),
);
