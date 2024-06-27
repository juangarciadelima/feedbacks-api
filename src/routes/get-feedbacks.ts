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

    const participant = await prisma.participants.findFirst({
      where: {
        name: participantName,
      },
    });

    const feedbacks = await prisma.feedbacks.findMany({
      where: {
        reviewed: participantName,
      },
      take: limit,
    });

    if (!feedbacks.length) {
      set.status = 400;
      return { message: "No feedbacks found for that user" };
    }

    if (participant?.userType !== "ADMIN") {
      set.status = 403;
      return { message: "You are not authorized to view feedbacks" };
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
      participantName: t.Optional(t.String()),
      limit: t.Optional(t.Number({ minimum: 1 })),
    }),
  }
);
