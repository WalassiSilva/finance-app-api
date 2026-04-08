import { UserNotFoundError } from "../../errors/user.js";

export class GetUserBalanceUseCase {
  constructor(getUserBalanceRepository, getuserByIdRepository) {
    this.getUserBalanceRepository = getUserBalanceRepository;
    this.getuserByIdRepository = getuserByIdRepository;
  }
  async execute(params) {
    const user = await this.getuserByIdRepository.execute(params.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const balance = await this.getUserBalanceRepository.execute(params.userId);

    return balance;
  }
}
