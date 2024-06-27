import { Elysia } from "elysia";
import { getFeedbacks } from "@/routes/get-feedbacks.ts";
import { swagger } from "@elysiajs/swagger";
import { getParticipants } from "@/routes/get-participants.ts";
import { getQuestion } from "@/routes/get-question.ts";
import { getQuestions } from "@/routes/get-questions.ts";
import { createFeedback } from "@/routes/create-feedback.ts";
import { getAddedFeedbacks } from "@/routes/get-added-feedbacks.ts";
import { getReceivedFeedbacks } from "@/routes/get-received-feedbacks.ts";
import { saveUser } from "@/routes/save-user.ts";

export const app = new Elysia({ prefix: "/api" })
  .use(
    swagger({
      documentation: {
        info: {
          title: "Feedbacks API",
          description:
            "API to manage received and added feedbacks by users in the system",
          version: "1.0.0",
        },
      },
    })
  )
  .use(getFeedbacks)
  .use(getParticipants)
  .use(getQuestion)
  .use(getQuestions)
  .use(createFeedback)
  .use(getAddedFeedbacks)
  .use(getReceivedFeedbacks)
  .use(saveUser)
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
