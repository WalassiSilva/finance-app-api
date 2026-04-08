import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const balance = await PostgresHelper.query(
      `
      SELECT 
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS Incomes,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS Expenses,
        SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS Investments,
        (
          SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) 
          - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
          - SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) 
        ) AS BALANCE
        FROM transactions
        WHERE user_id = $1;
      `,
      [userId],
    );
    return balance[0];
  }
}
