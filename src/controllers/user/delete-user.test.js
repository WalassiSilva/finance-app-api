import { faker } from "@faker-js/faker";
import { DeleteUserController } from "./delete-user.js";
import { makeStrictEnum } from "@prisma/client/runtime/library.js";

describe("DeleteUserController", () => {
  class DeleteUserUseCaseStub {
    execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      };
    }
  }
  const makeSut = () => {
    const deleteuserUseCase = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteuserUseCase);
    return { deleteuserUseCase, sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it("Should return 200 if user is deleted", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(200);
  });

  it("Should return 400 if id is invalid", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({ params: { userId: "Invalid_id" } });

    expect(result.statusCode).toBe(400);
  });

  it("Should return 404if user is not found", async () => {
    const { sut, deleteuserUseCase } = makeSut();
    jest.spyOn(deleteuserUseCase, "execute").mockReturnValueOnce(null);
    const result = await sut.execute(httpRequest);
    expect(result.statusCode).toBe(404);
  });

  it("Should return 500 if DeletedUserUseCase throws", async () => {
    const { sut, deleteuserUseCase } = makeSut();
    jest.spyOn(deleteuserUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await sut.execute(httpRequest);
    expect(result.statusCode).toBe(500);
  });
});
