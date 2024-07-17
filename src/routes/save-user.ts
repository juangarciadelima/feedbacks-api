import { prisma } from "@/lib/prisma.ts";
import { UserType } from "@prisma/client";
import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";

export const saveUser = new Elysia({
  tags: ["User"],
  detail: {
    description: "Save a user in the system",
  },
}).post(
  "/user",
  async ({ body, set }) => {
    const { user: userObject } = body;

    const userId = randomUUID();

    if (
      !(await prisma.participants.findFirst({
        where: { email: userObject.email },
      }))
    ) {
      await prisma.participants.create({
        data: {
          email: userObject.email,
          name: userObject.name,
          id: userId,
          userType: userObject.userType,
        },
      });
    } else {
      set.status = 400;
      return { message: "Usuário já cadastrado" };
    }

    set.status = 201;
  },
  {
    body: t.Object({
      user: t.Object({
        email: t.String({
          minLength: 1,
          format: "email",
          error: "Email inválido",
        }),
        name: t.String({ minLength: 1 }),
        userType: t.Enum(UserType, { error: "Tipo de usuário é inválido" }),
      }),
    }),
  }
);
