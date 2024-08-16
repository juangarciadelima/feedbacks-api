import { authentication } from "@/http/auth.ts"
import { prisma } from "@/lib/prisma.ts"
import { sign } from "crypto"
import { Elysia, t } from "elysia"

export const loginUser = new Elysia({
	tags: ["User"],
	detail: {
		description: "Login user in the system",
	},
})
	.use(authentication)
	.post(
		"/login-user",
		async ({ body, set, signUser }) => {
			const { user: userObject } = body

			const databaseUser = await prisma.participants.findFirst({
				where: { email: userObject.email },
			})
			if (!databaseUser) {
				set.status = 400
				return { message: "Usuário não possui login no sistema" }
			} else {
				await signUser({
					name: databaseUser.name,
					email: databaseUser.email,
					role: databaseUser.userType,
				})

				set.status = 200
				return {
					name: databaseUser.name,
					email: databaseUser.email,
					role: databaseUser.userType,
				}
			}
		},
		{
			body: t.Object({
				user: t.Object({
					email: t.String({
						minLength: 1,
						format: "email",
						error: "Email inválido",
					}),
					password: t.String({ minLength: 1 }),
				}),
			}),
		},
	)
