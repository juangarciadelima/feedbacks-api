import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";

export const getAddedFeedbacks = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Get received and added feedbacks by user",
  },
}).get(
  "/list-feedbacks/added",
  async ({ body, query, set }) => {
    const { participantName } = body;
    const { limit } = query;

    const feedbacks = await prisma.feedbacks.findMany({
      where: {
        reviewer: {
          equals: participantName,
        },
      },
      take: limit,
    });

    if (!feedbacks.length) {
      set.status = 400;
      return { message: "Não foram encontrados feedbacks para este usuário" };
    }

    set.status = 200;
    return [
      feedbacks.map((feedback) => ({
        id: feedback.id,
        reviewer: feedback.reviewer,
        reviewed: feedback.reviewed,
        date: feedback.date,
        questions: feedback.questions,
      })),
    ];
  },
  {
    query: t.Object({
      participantName: t.String(),
      limit: t.Optional(t.Number({ minimum: 1 })),
    }),
    body: t.Object({
      participantName: t.String(),
    }),
  }
);
