import { prisma } from "@/lib/prisma.ts"
import { Elysia, t } from "elysia"

export const deleteUser = new Elysia({
	tags: ["User"],
	detail: {
		description: "Delete a User",
	},
}).delete(
	"/admin/user/:userId",
	async ({ params }) => {
		const { userId } = params

		try {
			await prisma.participants.delete({
				where: {
					id: userId,
				},
			})
		} catch (error: any) {
			return new Response(null, { status: 400, statusText: error.message })
		}

		return new Response(null, { status: 204 })
	},
	{
		params: t.Object({
			userId: t.String({ minLength: 1 }),
		}),
	},
)
