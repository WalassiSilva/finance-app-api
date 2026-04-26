import { UpdateTransactionController } from "./update-transaction";
import { faker } from "@faker-js/faker";

describe("UpdateTransactionController", () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: "EXPENSE",
        amount: Number(faker.finance.amount()),
      };
    }
  }
  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCase);
    return { sut, updateTransactionUseCase };
  };

  const httpRequest = {
    params: { transactionId: faker.string.uuid() },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: "EXPENSE",
      amount: Number(faker.finance.amount()),
    },
  };
  it("Should return 200 when transaction is updated successufully", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(200);
  });

  it("Should return 400 when transactionId is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      params: { transactionId: "invalid_id" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });

  it("Should return 400 when transaction has unallowed field provided", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      body: { ...httpRequest.body, unallowed_field: "Unallowed_value" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });
  it("Should return 400 when transactionId amount is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      body: { amount: "invalid_amount" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });
  it("Should return 400 when transactionId type is invalid", async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const result = await sut.execute({
      ...httpRequest,
      body: { type: "invalid_type" },
    });
    //assert
    expect(result.statusCode).toBe(400);
  });
  it("Should return 500 when update transaction throws an error", async () => {
    //arrange
    const { sut, updateTransactionUseCase } = makeSut();
    jest
      .spyOn(updateTransactionUseCase, "execute")
      .mockRejectedValueOnce(new Error());
    //act
    const result = await sut.execute(httpRequest);
    //assert
    expect(result.statusCode).toBe(500);
  });
  it("Should call UpdateTransactionUseCase with correct params", async () => {
    const { sut, updateTransactionUseCase } = makeSut();
    const executeSpy = jest.spyOn(updateTransactionUseCase, "execute");
    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.transactionId,
      httpRequest.body,
    );
  });
});
