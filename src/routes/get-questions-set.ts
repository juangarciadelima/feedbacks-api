import { Elysia } from "elysia"
import { prisma } from "@/lib/prisma.ts"
import { UserType } from "@prisma/client"
import { NotAAdminError } from "./errors/not-a-admin-error.ts"

export const getQuestions = new Elysia({
	tags: ["Question Set"],
	detail: {
		description: "Get all the Questions Set",
	},
}).get("/list-questions", async ({ set, store }) => {
	const user: any = store
	

	if(!(user.role !== UserType.ADMIN)){
		const questions = await prisma.questionsSet.findMany({
			orderBy: {
				questionSetName: "asc",
			},
			select: {
				id: true,
				questionSetName: true,
				activatedSet: true,
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
	
		if (!questions.length) {
			set.status = 400
			return { message: "Nenhum método de avaliação foi encontrado" }
		}
	
		return { questions }
	} 

	throw new NotAAdminError()

})
