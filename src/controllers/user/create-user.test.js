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

  it("Should return status code 400 when firts_name is not provided", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        last_name: "Silva",
        email: "ws@email.com",
        password: "asd341df",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when e-mail is not provided", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: "Walassi",
        last_name: "Silva",
        password: "asd341df",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when e-mail is not valid", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: "Walassi",
        last_name: "Silva",
        email: "wa",
        password: "asd341df",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when password is not provided", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: "Walassi",
        last_name: "Silva",
        email: "ws@email.com",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);
    //assert

    expect(result.statusCode).toBe(400);
  });
  it("Should return status code 400 when password has less than 6 chars", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: "Walassi",
        last_name: "Silva",
        email: "ws@email.com",
        password: "asd",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);
    //assert

    expect(result.statusCode).toBe(400);
  });
});
