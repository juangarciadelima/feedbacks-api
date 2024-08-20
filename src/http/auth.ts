import { NotAAdminError } from "@/routes/errors/not-a-admin-error.ts";
import { UnauthorizedError } from "@/routes/errors/unauthorized-error.ts";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia, t, type Static } from "elysia";

const jwtPayloadSchema = t.Object({
  name: t.String(),
  email: t.String(),
  role: t.String()
});

const extractToken = (authorization: string) => {
  return authorization.substring(7, authorization.length);
};

export const authentication = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_ADMIN: NotAAdminError
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UNAUTHORIZED":
        set.status = 401;
        return {
          code,
          message: error.message
        };
      case "NOT_A_ADMIN":
        set.status = 401;
        return {
          code,
          message: error.message
        };
    }
  })
  .use(
    jwt({
      name: "jwt",
      secret: "JWT-KEY-TEST",
      schema: jwtPayloadSchema
    })
  )
  .use(cookie())
  .derive(({ jwt, headers }) => {
    return {
      getUser: async () => {
        const token = extractToken(headers.authorization ?? "");

        const user = await jwt.verify(token);

        if (!user) {
          throw new UnauthorizedError();
        }

        return user;
      },
      signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
        return {
          token_access: await jwt.sign(payload),
          expires_in: 60 * 5
        };
      }
    };
  })
  .derive(({ getUser }) => {
    return {
      getCurrentUser: async () => {
        const user = await getUser();

        return user;
      }
    };
  })
  .as("global");
