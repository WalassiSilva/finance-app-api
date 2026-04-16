import { EmailAlreadyInUseError } from "../../errors/user";
import { CreateUserController } from "./create-user";
import { faker } from "@faker-js/faker";
describe("Create user Controller", () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }
  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);
    return { sut: createUserController, createUserUseCase };
  };
  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  };

  it("Should return 201 when creating a user successfully", async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  it("Should return status code 400 when firts_name is not provided", async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest.body, first_name: undefined },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when e-mail is not provided", async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest.body, email: undefined },
    });
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when e-mail is not valid", async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest.body, email: "invalid_email" },
    });
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when password is not provided", async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest.body, password: undefined },
    });
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should return status code 400 when password has less than 6 chars", async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 4 }),
      },
    });
    //assert

    expect(result.statusCode).toBe(400);
  });

  it("Should call createUserUseCase with correct params", async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    const executeSpy = jest.spyOn(createUserUseCase, "execute");

    //act
    await sut.execute(httpRequest);
    //assert

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("Should return 500 if CreateUserUseCase throws an Error", async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(500);
  });

  it("Should return 400 if CreateUserUseCase throws EmailAlreadyInUseError", async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(httpRequest.body.email);
    });

    //act
    const result = await sut.execute(createUserUseCase);
    //assert
    expect(result.statusCode).toBe(400);
  });
});
