import { prisma } from "@/lib/prisma.ts"

import { Elysia } from "elysia"

export const getActivatedGroup = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Get the activated Question Set",
	},
}).get("/activated-group", async ({ set }) => {
	const activatedQuestionSet = await prisma.questionsSet.findFirstOrThrow({
		where: { activatedSet: true },
	})

	if (!activatedQuestionSet) {
		set.status = 400
		return { message: "Nenhum método de avaliação padrão foi encontrado" }
	}

	return { activatedQuestionSet }
})
