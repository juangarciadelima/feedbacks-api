import { prisma } from "@/lib/prisma.ts";

import { Elysia, t } from "elysia";

export const activateGroup = new Elysia({
  tags: ["General"],
  detail: {
    description: "Create a Question Set",
  },
}).post(
  "/activate-group",
  async ({ body, set }) => {
    const { questionSetTitle } = body;

    const questionSet = await prisma.questionsSet.findFirst({
      where: { questionSetName: questionSetTitle },
    });

    const actualActivatedQuestionSet =
      await prisma.questionsSet.findFirstOrThrow({
        where: { activatedSet: true },
      });

    if (actualActivatedQuestionSet) {
      await prisma.$transaction(async () => {
        try {
          await prisma.questionsSet.update({
            where: {
              id: actualActivatedQuestionSet.id,
            },
            data: {
              activatedSet: false,
            },
          });
          await prisma.questionsSet.update({
            where: {
              id: questionSet?.id,
            },
            data: {
              activatedSet: true,
            },
          });
        } catch (error) {
          set.status = 400;
          return { message: "Erro ao trocar método padrão de avaliação" };
        }
      });

      set.status = 200;
      return { message: "Método de avaliação criado com sucesso" };
    } else {
      set.status = 400;
      return { message: "Nenhum método de avaliação padrão foi encontrado" };
    }
  },
  {
    body: t.Object({
      questionSetTitle: t.String({ minLength: 1 }),
    }),
  }
);
