import { faker } from "@faker-js/faker";
import { CreateTransactionController } from "./create-transaction.js";
describe("CreateTransaction", () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction;
    }
  }
  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCase);
    return { sut, createTransactionUseCase };
  };
  const httpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: "EXPENSE",
      amount: Number(faker.finance.amount()),
    },
  };
  it("Should return 201 when creating EXPENSE successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
  });
  it("Should return 201 when creating INCOME successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: { ...httpRequest.body, type: "INCOME" },
    });

    expect(result.statusCode).toBe(201);
  });
  it("Should return 201 when creating INVESTMENT successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: { ...httpRequest.body, type: "INVESTMENT" },
    });

    expect(result.statusCode).toBe(201);
  });
  it("Should return 400 when missing user_id", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, user_id: undefined },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should retunr 400 when missing name", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, name: undefined },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should retunr 400 when missing date", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, date: undefined },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should retunr 400 when missing amount", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, amount: undefined },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should retunr 400 when missing type", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, type: undefined },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should retunr 400 when date is invalid", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, date: "invalid_date" },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should retunr 400 when amount is invalid", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      body: { ...httpRequest.body, amount: "invalid_amount" },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should return 500 when CreateTransactionUseCase throws an Error", async () => {
    const { sut, createTransactionUseCase } = makeSut();
    jest
      .spyOn(createTransactionUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
  it("Should call CreateTransactionUseCase with correct params", async () => {
    const { sut, createTransactionUseCase } = makeSut();
    executeSpy = jest.spyOn(createTransactionUseCase, "execute");
    const userId = faker.string.uuid();
    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
