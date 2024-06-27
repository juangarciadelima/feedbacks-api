import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";

export const getAddedFeedbacks = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Get received and added feedbacks by user",
  },
}).get(
  "/list-feedbacks/added",
  async ({ query, set }) => {
    const { participantName, limit } = query;

    const participant = await prisma.participants.findFirst({
      where: {
        name: participantName,
      },
    });

    const feedbacks = await prisma.feedbacks.findMany({
      where: {
        reviewer: participantName,
      },
      take: limit,
    });

    if (!feedbacks.length) {
      set.status = 400;
      return { message: "No feedbacks found for that user" };
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
