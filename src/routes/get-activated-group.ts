import { prisma } from "@/lib/prisma.ts";

import { Elysia } from "elysia";

export const getActivatedGroup = new Elysia({
  tags: ["General"],
  detail: {
    description: "Get the activated Question Set",
  },
}).get("/activated-group", async ({ set }) => {
  const activatedQuestionSet = await prisma.questionsSet.findFirstOrThrow({
    omit: {
      id: true,
    },
    where: { activatedSet: true },
  });

  if (!activatedQuestionSet) {
    set.status = 400;
    return { message: "Nenhum método de avaliação padrão foi encontrado" };
  }

  set.status = 200;
  return { activatedQuestionSet };
});
