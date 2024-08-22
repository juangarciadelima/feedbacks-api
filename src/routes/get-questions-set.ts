import { Elysia } from "elysia";
import { prisma } from "@/lib/prisma.ts";


export const getQuestions = new Elysia({
  tags: ["Question Set"],
  detail: {
    description: "Get all the Questions Set"
  }
}).get("/list-questions", async ({ set }) => {

  const questions = await prisma.questionsSet.findMany({
    orderBy: {
      questionSetName: "asc"
    },
    select: {
      id: true,
      questionSetName: true,
      activatedSet: true,
      numberOfStars: true,
      writable: true,
      questions: {
        select: {
          questionName: true,
          questionType: true,
          questionDescription: true

        }
      }
    }
  });

  if (!questions.length) {
    set.status = 400;
    return { message: "Nenhum método de avaliação foi encontrado" };
  }

  return { questions };

});
