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

    const isActivatedSet = await prisma.questionsSet.findFirst({
      where: { activatedSet: true },
    });


    try {
      await prisma.questionsSet.create({
        data: {
          activatedSet: isActivatedSet ? false : true,
          id: randomUUID(),
          numberOfStars: questionSetObject.numberOfStars,
          questionSetName: questionSetObject.questionSetName,
          questions: questionSetObject.questions,
        },
      });
    } catch (error: any) {
      set.status = 400;
      return {
        message: "Erro ao criar método de avaliação",
        error: error.message,
      };
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
