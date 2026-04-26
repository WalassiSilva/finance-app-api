import { UserNotFoundError } from "../../errors/user.js";

export class GetUserBalanceUseCase {
  constructor(getuserByIdRepository, getUserBalanceRepository) {
    this.getUserByIdRepository = getuserByIdRepository;
    this.getUserBalanceRepository = getUserBalanceRepository;
  }
  async execute(userId) {
    const user = await this.getUserByIdRepository.execute(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const balance = await this.getUserBalanceRepository.execute(userId);

    return balance;
  }
}
