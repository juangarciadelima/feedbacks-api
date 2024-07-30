import { prisma } from "@/lib/prisma.ts"
import { QuestionType } from "@prisma/client"
import { Elysia, t } from "elysia"

export const createFeedback = new Elysia({
	tags: ["Feedbacks"],
	detail: {
		description: "Create a feedback",
	},
}).post(
	"/feedback",
	async ({ body, set }) => {
		const { feedback: feedbackObject } = body

		const isInvalid = feedbackObject.questions.some(
			(question) =>
				!question.rating || !question.observation || !question.justification,
		)

		if (!isInvalid) {
			try {
				await prisma.feedbacks.create({
					data: {
						reviewer: feedbackObject.reviewer,
						reviewed: feedbackObject.reviewed,
						questions: feedbackObject.questions,
						questionSetId: feedbackObject.questionSetId,
					},
				})

				await prisma.questionsSet.update({
					where: {
						id: feedbackObject.questionSetId,
					},
					data: {
						writable: false,
					},
				})
			} catch (err) {
				console.log(err)
			}

			return new Response(null, { status: 201 })
		}

		return new Response(null, {
			status: 400,
			statusText: "Feedback doesn't have any ratings",
		})
	},
	{
		body: t.Object({
			feedback: t.Object({
				reviewer: t.String({ minLength: 1 }),
				reviewed: t.String({ minLength: 1 }),
				questions: t.Array(
					t.Object({
						questionName: t.String(),
						rating: t.Optional(t.Number({ minimum: 1 })),
						questionType: t.Enum(QuestionType),
						observation: t.Optional(t.String()),
						justification: t.Optional(t.String()),
					}),
				),
				questionSetId: t.String({ minLength: 1 }),
			}),
		}),
	},
)
