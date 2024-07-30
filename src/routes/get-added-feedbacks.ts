import { Elysia, t } from "elysia"
import { prisma } from "../lib/prisma.ts"
import type { Prisma } from "@prisma/client"

export const getAddedFeedbacks = new Elysia({
	tags: ["Feedbacks"],
	detail: {
		description: "Get Added Feedbacks",
	},
}).get(
	"/list-added-feedbacks",
	async ({ query }) => {
		const { participantName, reviewedParticipantName, limit, questionSetId } =
			query

		const whereData: Prisma.FeedbacksWhereInput = {}

		// if (startDate && endDate) {
		// 	whereData.date = {
		// 		gte: new Date(startDate),
		// 		lte: new Date(endDate),
		// 	};
		// }

		if (reviewedParticipantName) {
			whereData.reviewed = reviewedParticipantName
		}

		if (questionSetId) {
			whereData.questionSetId = questionSetId
		}

		const addedFeedbacks = await prisma.feedbacks.findMany({
			omit: {
				id: true,
			},
			where: {
				reviewer: participantName,
				...whereData,
			},
			take: limit,
			orderBy: {
				date: "desc",
			},
		})

		return { addedFeedbacks }
	},
	{
		query: t.Object({
			participantName: t.Optional(t.String()),
			limit: t.Optional(t.Numeric({ default: 10 })),
			// startDate: t.Optional(t.String()),
			// endDate: t.Optional(t.String()),
			questionSetId: t.Optional(t.String()),
			reviewedParticipantName: t.Optional(t.String()),
		}),
	},
)
