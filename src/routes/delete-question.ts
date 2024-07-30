import { prisma } from "@/lib/prisma.ts"
import { Elysia, t } from "elysia"

export const deleteQuestion = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Delete a Question Set",
	},
}).delete(
	"/question/:questionId",
	async ({ params }) => {
		const { questionId } = params

		try {
			await prisma.questionsSet.delete({
				where: {
					id: questionId,
				},
			})
		} catch (err) {
			console.log(err)
			return new Response(null, { status: 400 })
		}

		return new Response(null, { status: 204 })
	},
	{
		params: t.Object({
			questionId: t.String({ minLength: 1 }),
		}),
	},
)
