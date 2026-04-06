import { UserNotFoundError } from "../../errors/user.js";
export class GetUserTransactionsUseCase {
  constructor(getUserIdRepository, getUserTransactionsRepository) {
    this.getUserIdRepository = getUserIdRepository;
    this.getUserTransactionsRepository = getUserTransactionsRepository;
  }
  async execute(params) {
    const user = await this.getUserIdRepository.execute(params.userId);

    if (!user) {
      throw new UserNotFoundError(params.userId);
    }

    const transactions = await this.getUserTransactionsRepository.execute(
      params.userId,
    );

    return transactions;
  }
}
