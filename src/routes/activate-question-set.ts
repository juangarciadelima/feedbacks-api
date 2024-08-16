import { prisma } from "@/lib/prisma.ts"

import { Elysia, t } from "elysia"

export const activateQuestionSet = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Activate a Question Set as default",
	},
}).post(
	"/admin/activate-question-set",
	async ({ body, set }) => {
		const { questionSetTitle } = body

		const questionSet = await prisma.questionsSet.findFirst({
			where: { questionSetName: questionSetTitle },
		})

		const actualActivatedQuestionSet =
			await prisma.questionsSet.findFirstOrThrow({
				where: { activatedSet: true },
			})

		await prisma.$transaction(async () => {
			try {
				actualActivatedQuestionSet &&
					(await prisma.questionsSet.update({
						where: {
							id: actualActivatedQuestionSet.id,
						},
						data: {
							activatedSet: false,
						},
					}))

				await prisma.questionsSet.update({
					where: {
						id: questionSet?.id,
					},
					data: {
						activatedSet: true,
					},
				})
			} catch (error) {
				set.status = 400
				return { message: "Erro ao trocar método padrão de avaliação" }
			}
		})

		set.status = 201
	},
	{
		body: t.Object({
			questionSetTitle: t.String({ minLength: 1 }),
		}),
	},
)
