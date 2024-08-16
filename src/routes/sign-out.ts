import { Elysia } from "elysia";
import { authentication } from "@/http/auth.ts";

export const signOut = new Elysia()
  .use(authentication)
  .post("/sign-out", async ({ signOut }) => {
    signOut();
  });
