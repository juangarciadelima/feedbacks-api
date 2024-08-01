import { authentication } from "@/http/auth.ts"
import { prisma } from "@/lib/prisma.ts"

import { Elysia } from "elysia"
import { UnauthorizedError } from "./errors/unauthorized-error.ts"
import { NotAAdminError } from "./errors/not-a-admin-error.ts"

export const getActivatedGroup = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Get the activated Question Set",
	},
})
	.use(authentication)
	.get("/activated-group", async ({ getCurrentUser, set }) => {
		const activatedQuestionSet = await prisma.questionsSet.findFirstOrThrow({
			where: { activatedSet: true },
		})

		const { role } = await getCurrentUser()

		if (role !== "ADMIN") {
			throw new NotAAdminError()
		}

		if (!activatedQuestionSet) {
			set.status = 400
			return { message: "Nenhum método de avaliação padrão foi encontrado" }
		}

		return { activatedQuestionSet }
	})
