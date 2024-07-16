import { prisma } from "@/lib/prisma.ts";
import { Elysia, t } from "elysia";

export const deleteQuestion = new Elysia({
  tags: ["General"],
  detail: {
    description: "Delete a Question Set",
  },
}).delete(
  "/question/:userId",
  async ({ params }) => {
    const { questionId } = params;

    try {
      await prisma.questionsSet.delete({
        where: {
          id: questionId,
        },
      });
    } catch (error: any) {
      return new Response(null, { status: 400, statusText: error.message });
    }

    return new Response(null, { status: 204 });
  },
  {
    params: t.Object({
      questionId: t.String({ minLength: 1 }),
    }),
  }
);
