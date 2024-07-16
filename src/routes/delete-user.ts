import { prisma } from "@/lib/prisma.ts";
import { Elysia, t } from "elysia";

export const deleteUser = new Elysia({
  tags: ["User"],
  detail: {
    description: "Delete a User",
  },
}).delete(
  "/user/:userId",
  async ({ params }) => {
    const { userId } = params;
    await prisma.participants.delete({
      where: {
        id: userId,
      },
    });

    return new Response(null, { status: 204 });
  },
  {
    params: t.Object({
      userId: t.String({ minLength: 1 }),
    }),
  }
);
