import { Elysia } from "elysia";
import { getFeedbacks } from "@/routes/get-feedbacks.ts";
import { swagger } from "@elysiajs/swagger";
import { getParticipants } from "@/routes/get-participants.ts";
import { getQuestion } from "@/routes/get-question.ts";
import { getQuestions } from "@/routes/get-questions.ts";
import { createFeedback } from "@/routes/create-feedback.ts";
import { saveUser } from "@/routes/save-user.ts";
import { createQuestion } from "@/routes/create-question.ts";
import { cors } from "@elysiajs/cors";
import { loginUser } from "@/routes/login-user.ts";
import { activateGroup } from "@/routes/activate-group.ts";
import { getActivatedGroup } from "@/routes/get-activated-group.ts";
import { updateUser } from "@/routes/update-user.ts";
import { deleteUser } from "@/routes/delete-user.ts";
import { updateQuestion } from "@/routes/update-question.ts";
import { deleteQuestion } from "@/routes/delete-question.ts";

const port = process.env.PORT || 3333;

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
  .use(cors())
  .use(getFeedbacks)
  .use(getParticipants)
  .use(getQuestion)
  .use(getQuestions)
  .use(saveUser)
  .use(createFeedback)
  .use(createQuestion)
  .use(loginUser)
  .use(activateGroup)
  .use(getActivatedGroup)
  .use(updateUser)
  .use(deleteUser)
  .use(updateQuestion)
  .use(deleteQuestion)
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
