import { Elysia, t } from "elysia";
import { prisma } from "@/lib/prisma.ts";

export const getParticipants = new Elysia({
  tags: ["General"],
  detail: {
    description: "Get all participants in the system",
  },
}).get(
  "/list-participants",
  async ({ query, set }) => {
    const { email } = query;

    const participants = await prisma.participants.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        ...(!email
          ? {}
          : {
              NOT: {
                email: {
                  equals: email,
                },
              },
            }),
      },
    });

    if (!participants.length) {
      set.status = 400;
      return { message: "Não há participantes" };
    }

    set.status = 200;
    return participants.map((participant) => ({
      name: participant.name,
      email: participant.email,
      userType: participant.userType,
    }));
  },
  {
    query: t.Object({
      email: t.Optional(t.String({ minLength: 1, format: "email" })),
    }),
  }
);
