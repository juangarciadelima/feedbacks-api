import { Elysia, t } from "elysia";
import { prisma } from "@/lib/prisma.ts";

export const getQuestion = new Elysia({
  tags: ["General"],
  detail: {
    description: "Get questions set for the feedbacks",
  },
}).get(
  "/list-question/:setName",
  async ({ params, set }) => {
    const { setName } = params;
    const questionsSet = await prisma.questionsSet.findFirst({
      where: {
        questionSetName: setName,
      },
    });

    if (!questionsSet) {
      set.status = 400;
      return { message: "Método de avaliação não foi encontrado, tente novamente." };
    }

    set.status = 200;
    return { questionsSet };
  },
  {
    params: t.Object({
      setName: t.String(),
    }),
  }
);
