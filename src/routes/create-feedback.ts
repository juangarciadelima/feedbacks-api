import { prisma } from "@/lib/prisma.ts";
import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";

export const createFeedback = new Elysia({
  tags: ["Feedbacks"],
  detail: {
    description: "Create a feedback",
  },
}).post(
  "/feedback",
  async ({ body, set }) => {
    const { feedback: feedbackObject } = body;

    const feedbackId = randomUUID();

    try {
      await prisma.feedbacks.create({
        data: {
          id: feedbackId,
          reviewer: feedbackObject.reviewer,
          date: new Date(),
          reviewed: feedbackObject.reviewed,
          questions: feedbackObject.questions,
          avaliationInfo: {
            groupTitle: feedbackObject.avaliationInfo.groupTitle,
            numberOfStars: feedbackObject.avaliationInfo.numberOfStars,
          },
        },
      });
    } catch (error: any) {
      set.status = 400;
      return { message: "Erro ao criar feedback", error: error.message };
    }

    return { message: "Feedback criado com sucesso" };
  },
  {
    body: t.Object({
      feedback: t.Object({
        reviewer: t.String({ minLength: 1 }),
        reviewed: t.String({ minLength: 1 }),
        questions: t.Array(
          t.Object({
            question: t.Object({
              questionName: t.String(),
              rating: t.Number({ minimum: 1 }),
              observation: t.Union([t.String({ minLength: 1 }), t.Null()]),
              justification: t.Optional(t.String({ minLength: 1 })),
            }),
          })
        ),
        avaliationInfo: t.Object({
          groupTitle: t.String({ minLength: 1 }),
          numberOfStars: t.Number({ minimum: 1 }),
        }),
      }),
    }),
  }
);
