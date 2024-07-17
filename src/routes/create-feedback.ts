import { prisma } from "@/lib/prisma.ts";
import { QuestionType } from "@prisma/client";
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

    return new Response(null, { status: 201 });
  },
  {
    body: t.Object({
      feedback: t.Object({
        reviewer: t.String({ minLength: 1 }),
        reviewed: t.String({ minLength: 1 }),
        questions: t.Array(
          t.Object({
            questionName: t.String(),
            rating: t.Optional(t.Number({ minimum: 1 })),
            questionType: t.Enum(QuestionType),
            observation: t.Optional(t.String()),
            justification: t.Optional(t.String({ minLength: 1 })),
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
