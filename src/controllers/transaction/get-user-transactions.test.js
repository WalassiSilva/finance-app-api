import { GetUserTransactionsController } from "./get-user-transactions.js";
import { faker } from "@faker-js/faker";
import { UserNotFoundError } from "../../errors/user.js";

describe("GetUserTransactions", () => {
  class GetUserTransactionsUseCaseStub {
    async execute(userId) {
      return [
        {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          date: faker.date.anytime().toISOString(),
          type: "EXPENSE" || "INCOME" || "INVESTMENT",
          amount: Number(faker.finance.amount()),
        },
      ];
    }
  }
  const makeSut = () => {
    const getUserTransactionsUseCase = new GetUserTransactionsUseCaseStub();
    const sut = new GetUserTransactionsController(getUserTransactionsUseCase);
    return { sut, getUserTransactionsUseCase };
  };
  it("Should return 200 when getting transactions successufully", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      query: { userId: faker.string.uuid() },
    });
    expect(result.statusCode).toBe(200);
  });

  it("Should return 400 when userId is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      query: { userId: "invalid_id" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return 404 when GetUserTransactions userId is not found", async () => {
    //arrange
    const { sut, getUserTransactionsUseCase } = makeSut();
    jest
      .spyOn(getUserTransactionsUseCase, "execute")
      .mockRejectedValueOnce(new UserNotFoundError());
    //act
    const result = await sut.execute({
      query: { userId: faker.string.uuid() },
    });
    //assert
    expect(result.statusCode).toBe(404);
  });

  it("Should return 500 when getUserTransactionsUseCase throws an error", async () => {
    //arrange
    const { sut, getUserTransactionsUseCase } = makeSut();
    jest
      .spyOn(getUserTransactionsUseCase, "execute")
      .mockRejectedValue(new Error());
    //act
    const result = await sut.execute({
      query: { userId: faker.string.uuid() },
    });
    //assert
    expect(result.statusCode).toBe(500);
  });

  it("Should call GetUserTransactionUseCase with correct params", async () => {
    const { sut, getUserTransactionsUseCase } = makeSut();
    executeSpy = jest.spyOn(getUserTransactionsUseCase, "execute");
    const userId = faker.string.uuid();
    await sut.execute({ query: { userId } });

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
