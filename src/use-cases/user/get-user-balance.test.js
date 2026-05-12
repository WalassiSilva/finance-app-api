import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "./get-user-balance.js";
import { UserNotFoundError } from "../../errors/user.js";

describe("GetUserBalanceUseCase", () => {
  const userBalance = {
    incomes: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
  };
  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return userBalance;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserBalanceRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserByIdRepository,
      getUserBalanceRepository,
    );

    return {
      sut,
      getUserBalanceRepository,
      getUserByIdRepository,
    };
  };

  it("Should get user balance successfully", async () => {
    const { sut } = makeSut();
    const balance = await sut.execute(faker.string.uuid());
    expect(balance).toEqual(userBalance);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");
    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetUserBalanceRepository with correct params", async () => {
    // arrange
    const { sut, getUserBalanceRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getUserBalanceRepository, "execute");
    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("Should throws UserNotFoundError if GetuserByIdRepository returns null", async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValue(null);
    const userId = faker.string.uuid();
    //act
    const promise = sut.execute(userId);
    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("Should throws if GetuserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValue(new Error());
    const promise = sut.execute(faker.string.uuid());
    await expect(promise).rejects.toThrow();
  });
  it("Should throws if GetuserBalanceRepository throws", async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    jest
      .spyOn(getUserBalanceRepository, "execute")
      .mockRejectedValue(new Error());
    const promise = sut.execute(faker.string.uuid());
    await expect(promise).rejects.toThrow();
  });
});
