import { prisma } from "@/lib/prisma.ts"
import { QuestionType } from "@prisma/client"
import { Elysia, t } from "elysia"

export const updateQuestion = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Update a Question Set",
	},
}).put(
	"/question/:questionId",
	async ({ params, body }) => {
		const { questionSetId } = params

		const isWritableQuestionSet = await prisma.questionsSet.findUnique({
			where: {
				id: questionSetId,
			},
			select: {
				writable: true,
			},
		})

		if (isWritableQuestionSet) {
			await prisma.questionsSet.update({
				where: {
					id: questionSetId,
				},
				data: {
					...body.questionSet,
				},
			})

			return new Response(null, { status: 200 })
		}

		return new Response(null, {
			status: 400,
			statusText: "Question Set has feedbacks",
		})
	},
	{
		params: t.Object({
			questionSetId: t.String(),
		}),
		body: t.Object({
			questionSet: t.Object({
				numberOfStars: t.Number(),
				questionSetName: t.String(),
				questions: t.Array(
					t.Object({
						questionName: t.String(),
						questionType: t.Enum(QuestionType),
						questionDescription: t.Optional(t.String()),
					}),
				),
			}),
		}),
	},
)
