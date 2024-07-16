import { prisma } from "@/lib/prisma.ts";
import { QuestionType } from "@prisma/client";
import { Elysia, t } from "elysia";

export const updateQuestion = new Elysia({
  tags: ["Genberal"],
  detail: {
    description: "Update a Question Set",
  },
}).put(
  "/question/:questionId",
  async ({ params, body, set }) => {
    const { questionId } = params;

    await prisma.questionsSet.update({
      where: {
        id: questionId,
      },
      data: {
        ...body,
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
