import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import type { Prisma } from "@prisma/client";

export const getFeedbacks = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Get Feedbacks for the admin",
  },
}).get(
  "/list-feedbacks",
  async ({ query, set }) => {
    const { participantName, limit, startDate, endDate } = query;

    const whereData: Prisma.FeedbacksWhereInput = {};

    if (startDate && endDate) {
      whereData.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    console.log("participantName ->", participantName);

    const addedFeedbacks = await prisma.feedbacks.findMany({
      where: {
        reviewer: participantName,
        ...whereData,
      },
    });

    const receivedFeedbacks = await prisma.feedbacks.findMany({
      omit: {
        id: true,
      },
      where: {
        reviewed: participantName,
        ...whereData,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    if (!addedFeedbacks.length && !receivedFeedbacks.length) {
      set.status = 400;
      return { message: "Não foram encontradas avaliações" };
    }

    return { addedFeedbacks, receivedFeedbacks };
  },
  {
    query: t.Object({
      participantName: t.Optional(t.String()),
      limit: t.Optional(t.Numeric({ default: 10 })),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
    }),
  }
);
