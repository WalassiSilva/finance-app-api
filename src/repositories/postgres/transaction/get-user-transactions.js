import { prisma } from "../../../../prisma/prisma.js";
export class PostgresGetUserTransactionsRepository {
  async execute(userId) {
    const transaction = await prisma.transaction.findMany({
      where: { user_id: userId },
    });
    return transaction;
  }
}
