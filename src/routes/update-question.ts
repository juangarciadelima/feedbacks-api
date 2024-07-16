import { prisma } from "@/lib/prisma.ts";
import { QuestionType } from "@prisma/client";
import { Elysia, t } from "elysia";

export const updateQuestion = new Elysia({
  tags: ["General"],
  detail: {
    description: "Update a Question Set",
  },
}).put(
  "/question/:questionId",
  async ({ params, body }) => {
    const { questionId } = params;

    await prisma.questionsSet.update({
      where: {
        id: questionId,
      },
      data: {
        ...body.questionSet,
      },
    });

    return new Response(null, { status: 200 });
  },
  {
    params: t.Object({
      questionId: t.String(),
    }),
    body: t.Object({
      questionSet: t.Object({
        numberOfStars: t.Number(),
        questionSetName: t.String(),
        questions: t.Array(
          t.Object({
            questionName: t.String(),
            questionType: t.Enum(QuestionType),
            questionDescription: t.Optional(t.String()),
          })
        ),
      }),
    }),
  }
);
