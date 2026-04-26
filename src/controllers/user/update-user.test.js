import { EmailAlreadyInUseError } from "../../errors/user.js";
import { UpdateUserController } from "./update-user.js";
import { faker } from "@faker-js/faker";
describe("UpdateUserController", () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserUseCase = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCase);
    return { sut, updateUserUseCase };
  };
  const httpRequest = {
    params: { userId: faker.string.uuid() },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  };

  it("Should return 200 when user is updated successfully", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
  });

  it("Should return 400 when e-mail is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      body: { email: "Invalid_email" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });
  it("Should return 400 when password is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      body: { password: faker.internet.password({ length: 5 }) },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return 400 when userId is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      params: { userId: "invalid_id" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return 400 when unallowed field is provided", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      body: { unallowed_field: "unallowed_field" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return 500 when throw a generic error", async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut();
    jest.spyOn(updateUserUseCase, "execute").mockRejectedValueOnce(new Error());
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(500);
  });

  it("Should return 400 when throw EmailAlreadyInUse error", async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut();
    jest
      .spyOn(updateUserUseCase, "execute")
      .mockRejectedValueOnce(
        new EmailAlreadyInUseError(faker.internet.email()),
      );
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should call UpdateUserUseCase with correct params", async () => {
    const { sut, updateUserUseCase } = makeSut();
    const executeSpy = jest.spyOn(updateUserUseCase, "execute");
    await sut.execute(httpRequest);
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body,
    );
  });
});
