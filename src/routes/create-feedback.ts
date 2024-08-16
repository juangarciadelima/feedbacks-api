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
	async ({ body }) => {
		const { feedback: feedbackObject } = body


		try {
			await prisma.feedbacks.create({
				data: {
					reviewer: feedbackObject.reviewer,
					reviewed: feedbackObject.reviewed,
					questions: feedbackObject.questions,
					questionSetId: feedbackObject.questionSetGroup.id,
				},
			})

			await prisma.questionsSet.update({
				where: {
					id: feedbackObject.questionSetGroup.id,
				},
				data: {
					writable: false,
				},
			})
		} catch (err) {
			console.log(err)
		}

		return new Response(null, { status: 201 })
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
				questionSetGroup: t.Object({
					id: t.String({ minLength: 1 }),
					name: t.String({ minLength: 1 }),
				}),
			}),
		}),
	},
)
