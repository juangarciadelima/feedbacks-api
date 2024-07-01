import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";

export const getReceivedFeedbacks = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Get received feedbacks by user",
  },
}).get(
  "/list-feedbacks/received",
  async ({ query, set }) => {
    const { participantName, limit } = query;

    const feedbacks = await prisma.feedbacks.findMany({
      where: {
        reviewed: participantName,
      },
      take: limit,
    });
    

    if (!feedbacks.length) {
      set.status = 400;
      return { message: "Feedbacks não foram encontrados para este usuário" };
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
  }
);
