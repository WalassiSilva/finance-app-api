import { prisma } from "../../../../prisma/prisma.js";
export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transaction.aggregate({
      where: { user_id: userId, type: "EXPENSE" },
      _sum: { amount: true },
    });

    const {
      _sum: { amount: totalIncomes },
    } = await prisma.transaction.aggregate({
      where: { user_id: userId, type: "INCOME" },
      _sum: { amount: true },
    });

    const {
      _sum: { amount: totalInvestments },
    } = await prisma.transaction.aggregate({
      where: { user_id: userId, type: "INVESTMENT" },
      _sum: { amount: true },
    });

    const balance = totalIncomes - totalExpenses - totalInvestments;

    return {
      incomes: totalIncomes,
      expenses: totalExpenses,
      investments: totalInvestments,
      balance,
    };
  }
}
