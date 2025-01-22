import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient().$extends({
  model: {
    admin: {
      async singIn({ email, password }) {
        // const admin = await orm
      },
    },
  },
});
