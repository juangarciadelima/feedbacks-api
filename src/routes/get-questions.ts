import { Elysia } from "elysia";
import { prisma } from "@/lib/prisma.ts";

export const getQuestions = new Elysia({
  tags: ["General"],
  detail: {
    description: "Get questions set for the feedbacks",
  },
}).get("/list-questions", async ({ set }) => {
  const questions = await prisma.questionsSet.findMany();

  if (!questions.length) {
    set.status = 400;
    return { message: "No questions found" };
  }

  set.status = 200;
  return { questions };
});
