import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetUserByImail {
  async execute(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
