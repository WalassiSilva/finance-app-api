import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "./get-user-balance.js";
describe("GetUserBalanceController", () => {
  class GetUserBalanceUseCaseStup {
    async execute() {
      return faker.number.int();
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCaseStup();
    const getUserBalanceController = new GetUserBalanceController(
      getUserBalanceUseCase,
    );
    return { sut, getUserBalanceController };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it("Should return 200 when getting user balance", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(200);
  });

  it("Should return 400 when userId is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      params: { userId: "invalid_id" },
    });
    //assert
    exepct(result.statusCode).toBe(400);
  });

  it("Should return 500 if GetUserBalanceUseCase throws", async () => {
    //arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    jest
      .spyOn(getUserBalanceUseCase, "execute")
      .mockRejectdValueOnce(new Error());
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(500);
  });

  it("Should call GetUserBalanceUseCase with correct params", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();
    const executeSpy = jest.spyOn(getUserBalanceUseCase, "execute");
    await sut.execute(httpRequest);
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});
