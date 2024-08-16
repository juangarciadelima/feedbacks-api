import { prisma } from '@/lib/prisma.ts';
import { UserType } from '@prisma/client';
import { Elysia, t } from 'elysia';


export const registerUser = new Elysia({
  tags: ["User"],
	detail: {
		description: "Rgister user in database",
	},
}).post('/register', async ({body}) => {
  const { user: userObject } = body

  try {
    await prisma.participants.create({
      data: {
        name: userObject.name,
        email: userObject.email,
        userType: UserType.PARTICIPANT,
      },
    })
  } catch (err) {
    console.log(err)
  }

  return new Response(null, { status: 201 })
}, {
  body: t.Object({
    user: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ minLength: 1, format: 'email' }),
      password: t.String({ minLength: 1 }),
    })
  })
})