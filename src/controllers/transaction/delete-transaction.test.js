import { DeleteTransactionController } from "./delete-transaction.js";
import { faker } from "@faker-js/faker";

describe("DeleteTransaction", () => {
  class DeleteTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: "EXPENSE" || "INCOME" || "INVESTMENT",
        amount: Number(faker.finance.amount()),
      };
    }
  }
  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCase);
    return { sut, deleteTransactionUseCase };
  };

  it("Should return 200 when deleting transaction successfully", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });
    expect(result.statusCode).toBe(200);
  });
  it("Should return 400 when transaction id is invalid", async () => {
    const { sut } = makeSut();
    const result = await sut.execute({
      params: { transactionId: "invalid_id" },
    });
    expect(result.statusCode).toBe(400);
  });
  it("Should return 404 when transaction is not found", async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    jest.spyOn(deleteTransactionUseCase, "execute").mockResolvedValueOnce(null);

    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });
    expect(result.statusCode).toBe(404);
  });
  it("Should return 404 when transaction is not found", async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    jest
      .spyOn(deleteTransactionUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });
    expect(result.statusCode).toBe(500);
  });
});
