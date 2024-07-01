import { prisma } from "@/lib/prisma.ts";
import { QuestionType } from "@prisma/client";
import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";

export const createQuestion = new Elysia({
  tags: ["General"],
  detail: {
    description: "Create a Question Set",
  },
}).post(
  "/question",
  async ({ body, set }) => {
    const { questionSet: questionSetObject } = body;

    try {
      await prisma.questionsSet.create({
        data: {
          numberOfStars: questionSetObject.numberOfStars,
          id: randomUUID(),
          questionSetName: questionSetObject.questionSetName,
          questions: questionSetObject.questions,
        },
      });
    } catch (error) {
      set.status = 400;
      return { message: "Erro ao criar método de avaliação" };
    }

    set.status = 200;
    return { message: "Método de avaliação criado com sucesso" };
  },
  {
    body: t.Object({
      questionSet: t.Object({
        numberOfStars: t.Number({ minimum: 1 }),
        questionSetName: t.String({ minLength: 1 }),
        questions: t.Array(
          t.Object({
            questionName: t.String(),
            questionType: t.Enum(QuestionType),
            questionDescription: t.String({ minLength: 1 }),
          })
        ),
      }),
    }),
  }
);
