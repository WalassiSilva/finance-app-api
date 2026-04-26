import { UserNotFoundError } from "../../errors/user.js";
export class GetUserTransactionsUseCase {
  constructor(getUserIdRepository, getUserTransactionsRepository) {
    this.getUserIdRepository = getUserIdRepository;
    this.getUserTransactionsRepository = getUserTransactionsRepository;
  }
  async execute(userId) {
    const user = await this.getUserIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactions =
      await this.getUserTransactionsRepository.execute(userId);

    return transactions;
  }
}
