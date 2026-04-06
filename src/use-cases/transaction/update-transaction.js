import { UserNotFoundError } from "../../errors/user.js";

export class UpdateTransactionUseCase {
  constructor(getuserByIdRepository, updateTransactionRepository) {
    this.getuserByIdRepository = getuserByIdRepository;
    this.updateTransactionRepository = updateTransactionRepository;
  }

  async execute(params) {
    const user = await this.getuserByIdRepository.execute(params.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const transaction = await this.updateTransactionRepository.execute(params);

    return transaction;
  }
}
