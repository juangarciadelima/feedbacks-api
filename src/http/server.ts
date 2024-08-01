import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { getParticipants } from "@/routes/get-participants.ts"
import { getQuestion } from "@/routes/get-question-set.ts"
import { getQuestions } from "@/routes/get-questions-set.ts"
import { createFeedback } from "@/routes/create-feedback.ts"
import { saveUser } from "@/routes/save-user.ts"
import { createQuestion } from "@/routes/create-question.ts"
import { cors } from "@elysiajs/cors"
import { loginUser } from "@/routes/login-user.ts"
import { activateQuestionSet } from "@/routes/activate-question-set.ts"
import { getActivatedGroup } from "@/routes/get-activated-group.ts"
import { updateUser } from "@/routes/update-user.ts"
import { deleteUser } from "@/routes/delete-user.ts"
import { updateQuestion } from "@/routes/update-question.ts"
import { deleteQuestion } from "@/routes/delete-question.ts"
import { getAddedFeedbacks } from "@/routes/get-added-feedbacks.ts"
import { getReceivedFeedbacks } from "@/routes/get-received-feedbacks.ts"
import { authentication } from "./auth.ts"
import { get } from "node:http"

const port = process.env.PORT || 3333

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
		}),
	)
	.use(
		cors({
			credentials: true,
			allowedHeaders: ["content-type"],
			methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
			origin: (request): boolean => {
				const origin = request.headers.get("Origin") || ""

				if (!origin) {
					return false
				}

				return true
			},
		}),
	)
	.use(authentication)
	.state('user', {})
	.onBeforeHandle(async ({ getCurrentUser, path, store }) => {
		if (path !== "/api/login-user") {
			try {
				const user = await getCurrentUser()
				store.user = user
			} catch (err) {
				console.log(err)
				throw err
			}
		}
	})
	.use(getParticipants)
	.use(getQuestion)
	.use(getQuestions)
	.use(saveUser)
	.use(createFeedback)
	.use(createQuestion)
	.use(loginUser)
	.use(activateQuestionSet)
	.use(getActivatedGroup)
	.use(updateUser)
	.use(deleteUser)
	.use(updateQuestion)
	.use(deleteQuestion)
	.use(getAddedFeedbacks)
	.use(getReceivedFeedbacks)
	.onError(({ code, error, set }) => {
		switch (code) {
			case "VALIDATION": {
				set.status = error.status

				return error.toResponse()
			}
			case "NOT_FOUND": {
				return new Response(null, { status: 404 })
			}
			default: {
				console.error(error)

				return new Response(null, { status: 500 })
			}
		}
	})
	.listen(port)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
