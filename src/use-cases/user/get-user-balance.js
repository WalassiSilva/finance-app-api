import { UserNotFoundError } from "../../errors/user.js";

export class GetUserBalanceUseCase {
  constructor(getuserByIdRepository, getUserBalanceRepository) {
    this.getUserByIdRepository = getuserByIdRepository;
    this.getUserBalanceRepository = getUserBalanceRepository;
  }
  async execute(params) {
    const user = await this.getUserByIdRepository.execute(params.userId);
    if (!user) {
      throw new UserNotFoundError(params.userId);
    }

    const balance = await this.getUserBalanceRepository.execute(params.userId);

    return balance;
  }
}
