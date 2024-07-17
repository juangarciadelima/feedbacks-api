import { Elysia, t } from "elysia";
import { prisma } from "@/lib/prisma.ts";

export const getQuestion = new Elysia({
  tags: ["General"],
  detail: {
    description: "Get question set for the feedback",
  },
}).get(
  "/list-question/:setName",
  async ({ params, set }) => {
    const { setName } = params;
    const questionsSet = await prisma.questionsSet.findFirst({
      where: {
        questionSetName: setName,
      },
      select: {
        activatedSet: true,
        questionSetName: true,
        numberOfStars: true,
        questions: {
          select: {
            questionName: true,
            questionType: true,
            questionDescription: true,
          },
        },
      },
    });

    if (!questionsSet) {
      set.status = 400;
      return {
        message: "Método de avaliação não foi encontrado, tente novamente.",
      };
    }

    return { questionsSet };
  },
  {
    params: t.Object({
      setName: t.String(),
    }),
  }
);
