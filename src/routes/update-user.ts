import { prisma } from "@/lib/prisma.ts";
import { UserType } from "@prisma/client";
import { Elysia, t } from "elysia";

export const updateUser = new Elysia({
  tags: ["User"],
  detail: {
    description: "Update a User",
  },
}).put(
  "/user/:userId",
  async ({ params, body }) => {
    const { userId } = params;

    await prisma.participants.update({
      where: {
        id: userId,
      },
      data: body,
    });

    return new Response(null, { status: 200 });
  },
  {
    params: t.Object({
      userId: t.String(),
    }),
    body: t.Object({
      email: t.String({
        format: "email",
        error: "Email inválido",
      }),
      name: t.String(),
      userType: t.Enum(UserType, { error: "Tipo de usuário é inválido" }),
    }),
  }
);
