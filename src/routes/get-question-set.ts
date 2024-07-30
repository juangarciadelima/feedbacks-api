import { Elysia, t } from "elysia"
import { prisma } from "@/lib/prisma.ts"

export const getQuestion = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Get question set for the feedback",
	},
}).get(
	"/list-question/:questionSetId",
	async ({ params, set }) => {
		const { questionSetId } = params
		const questionsSet = await prisma.questionsSet.findFirst({
			where: {
				id: questionSetId,
			},
			select: {
				activatedSet: true,
				questionSetName: true,
				numberOfStars: true,
				questions: {
					select: {
						questionName: true,
						questionType: true,
						questionDescription: true,
					},
				},
			},
		})

		if (!questionsSet) {
			set.status = 400
			return {
				message: "Método de avaliação não foi encontrado, tente novamente.",
			}
		}

		return { questionsSet }
	},
	{
		params: t.Object({
			questionSetId: t.String(),
		}),
	},
)
