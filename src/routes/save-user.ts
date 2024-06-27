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
  "/feedback",
  async ({ body, set }) => {
    const { user: userObject } = body;

    const userId = randomUUID();

    await prisma.participants.create({
      data: {
        email: userObject.email,
        name: userObject.name,
        id: userId,
        userType: userObject.userType,
      },
    });

    set.status = 200;
    return { message: "Feedback created successfully" };
  },
  {
    body: t.Object({
      user: t.Object({
        email: t.String({ minLength: 1 }),
        name: t.String({ minLength: 1 }),
        userType: t.Enum(UserType),
      }),
    }),
  }
);
