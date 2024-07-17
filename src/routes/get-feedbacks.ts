import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";

export const getFeedbacks = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Get Feedbacks for the admin",
  },
}).get(
  "/list-feedbacks",
  async ({ query, set }) => {
    const { participantName, limit } = query;

    const feedbacks = await prisma.feedbacks.findMany({
      omit: {
        id: true,
      },
      where: {
        reviewed: participantName,
        AND: {
          reviewer: {
            equals: participantName,
          },
        },
      },
      orderBy: {
        date: "desc",
      },

      take: limit,
    });

    if (!feedbacks) {
      set.status = 400;
      return { message: "Não foram encontradas avaliações" };
    }

    return { feedbacks };
  },
  {
    query: t.Object({
      participantName: t.Optional(t.String()),
      limit: t.Optional(t.Numeric({ default: 10 })),
    }),
  }
);
