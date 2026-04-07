import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostresDeleteTransactionRepository {
  async execute(transactionId) {
    const transaction = await PostgresHelper.query(
      `
      DELETE FROM transaction WHERE id = $1 RETURNING *`,
      [transactionId],
    );
    return transaction[0];
  }
}
