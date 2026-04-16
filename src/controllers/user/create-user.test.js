import { EmailAlreadyInUseError } from "../../errors/user";
import { CreateUserController } from "./create-user";
import { faker } from "@faker-js/faker";
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
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  it("Should return status code 400 when firts_name is not provided", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
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
        first_name: faker.person.firstName(),
        last_name: faker.internet.email(),
        password: faker.internet.password(),
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
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: "invalid_email",
        password: faker.internet.password(),
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
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
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
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: "asd",
      },
    };
    //act
    const result = await createUserController.execute(httpRequest);
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should call createUserUseCase with correct params", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    //act
    const executeSpy = jest.spyOn(createUserUseCase, "execute");
    await createUserController.execute(httpRequest);
    //assert

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("Should return 500 if CreateUserUseCase throws an Error", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    //act
    jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await createUserController.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(500);
  });

  it("Should return 400 if CreateUserUseCase throws EmailAlreadyInUseError", async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    //act
    jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(httpRequest.body.email);
    });
    const result = await createUserController.execute(createUserUseCase);
    //assert
    expect(result.statusCode).toBe(400);
  });
});
