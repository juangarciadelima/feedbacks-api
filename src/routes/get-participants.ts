import { Elysia, t } from "elysia";
import { prisma } from "@/lib/prisma.ts";

export const getParticipants = new Elysia({
  tags: ["General"],
  detail: {
    description: "Get all participants in the system",
  },
}).get("/list-participants", async ({ set }) => {
  const participants = await prisma.participants.findMany();

  if (!participants.length) {
    set.status = 400;
    return { message: "Não há participantes" };
  }

  set.status = 200;
  return { participants };
});
