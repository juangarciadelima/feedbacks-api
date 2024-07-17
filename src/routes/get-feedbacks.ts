import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import type { Prisma } from "@prisma/client";
import { ActionEnum } from "@/enums/actions.enum.ts";

export const getFeedbacks = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Get Feedbacks for the admin",
  },
}).get(
  "/list-feedbacks",
  async ({ query, set }) => {
    const { participantName, limit, startDate, endDate, action } = query;

    const where: Prisma.FeedbacksWhereInput = {};

    if (action === ActionEnum.ADDED) {
      where.reviewer = participantName;
    }

    if (action === ActionEnum.RECEIVED) {
      where.reviewed = participantName;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    console.log("participantName ->", participantName);

    // const receivedFeedbacks = await prisma.feedbacks.findMany({
    //   omit: {
    //     id: true,
    //   },
    //   where,
    //   orderBy: {
    //     date: "desc",
    //   },

    //   take: limit,
    // });

    const feedbacks = await prisma.feedbacks.findMany({
      omit: {
        id: true,
      },
      where,
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
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
      action: t.Enum(ActionEnum),
    }),
  }
);
