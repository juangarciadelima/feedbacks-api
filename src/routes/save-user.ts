import { prisma } from "@/lib/prisma.ts";
import { UserType } from "@prisma/client";
import { randomUUID } from "crypto";
import { Elysia, error, t } from "elysia";

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

    await prisma.participants.create({
      data: {
        email: userObject.email,
        name: userObject.name,
        id: userId,
        userType: userObject.userType,
      },
    });

    set.status = 200;
    return { message: "User saved successfully" };
  },
  {
    body: t.Object({
      user: t.Object({
        email: t.String({
          minLength: 1,
          format: "email",
          error: "Invalid Email",
        }),
        name: t.String({ minLength: 1 }),
        userType: t.Enum(UserType, { error: "Invalid User Type" }),
      }),
    }),
  }
);
