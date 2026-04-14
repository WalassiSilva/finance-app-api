import { CreateUserController } from "./create-user";
describe("Create user Controller", () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }

  it("Should return 201 when creating a user successfully", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: "Walassi",
        last_name: "Silva",
        email: "ws@email.com",
        password: "asd341df",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toBe(httpRequest.body);
  });
});
