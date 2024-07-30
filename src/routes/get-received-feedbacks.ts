import { Elysia, t } from "elysia"
import { prisma } from "../lib/prisma.ts"
import type { Prisma } from "@prisma/client"

export const getReceivedFeedbacks = new Elysia({
	tags: ["Feedbacks"],
	detail: {
		description: "Get Feedbacks for the admin",
	},
}).get(
	"/list-received-feedbacks",
	async ({ query }) => {
		const { participantName, limit, questionSetId } = query

		const whereData: Prisma.FeedbacksWhereInput = {}

		// if (startDate && endDate) {
		// 	whereData.date = {
		// 		gte: new Date(startDate),
		// 		lte: new Date(endDate),
		// 	};
		// }

		if (questionSetId) {
			whereData.questionSetId = questionSetId
		}

		const receivedFeedbacks = await prisma.feedbacks.findMany({
			omit: {
				id: true,
			},
			where: {
				reviewed: participantName,
				...whereData,
			},
			orderBy: {
				date: "desc",
			},
			take: limit,
		})

		return { receivedFeedbacks }
	},
	{
		query: t.Object({
			participantName: t.Optional(t.String()),
			limit: t.Optional(t.Numeric({ default: 10 })),
			// startDate: t.Optional(t.String()),
			// endDate: t.Optional(t.String()),
			questionSetId: t.Optional(t.String()),
		}),
	},
)
