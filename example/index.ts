import { Elysia, t } from "elysia";
import { jwt } from "../src";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: new TextEncoder().encode("secret"),
      sub: "auth",
      iss: "pichxyaponn",
      exp: "30d",
      schema: t.Object({
        name: t.String()
      })
    })
  )
  .get("/sign/:name", async ({ jwt, cookie: { auth }, params }) => {
    auth.set({
      value: await jwt.sign({
        ...params,
        exp: "1d"
      }),
      httpOnly: true,
      maxAge: 1 * 86400,
      path: "/"
    });

    return `Sign in as ${auth.value}`;
  })
  .get("/profile", async ({ jwt, set, cookie: { auth } }) => {
    try {
      const profile = await jwt.verify(auth.value);

      if (!profile) {
        set.status = 401;
        return "Unauthorized";
      }

      return `Hello ${profile.name}`;
    } catch (error: any) {
      switch (error.code) {
        case "ERR_JWT_EXPIRED":
          throw error;
        default:
          return false;
      }
    }
  })
  .listen(8080);
