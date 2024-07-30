import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

prisma = new PrismaClient({
	log: ["query"],
})

export { prisma }
