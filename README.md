# elysia-jwt

Plugin for [Elysia](https://github.com/pichxyaponn/elysia-jwt) for using JWT Authentication.

## Installation

```bash
bun add @pichxyaponn/elysia-jwt
```

## Example

```typescript
import { Elysia, t } from "elysia";
import { jwt } from "@pichxyaponn/jwt";
import { cookie } from "@elysiajs/cookie";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: "aawdaowdoj",
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
```

## Config

This package extends [jose](https://github.com/panva/jose), most config is inherited from Jose.

Below are configurable properties for using JWT plugin

### name

Name to decorate method as:

For example, `jwt` will decorate Context with `Context.jwt`

### secret

JWT secret key ( `Uint8Array | CryptoKey | JWK | KeyObject` )

### schema

Type strict validation for JWT payload

## Jose's config

Below is the config inherits from [jose](https://github.com/panva/jose). These can be set during plugin initialization to define default values for all tokens signed by that JWT instance.

### alg

@default 'HS256'

Algorithm to sign JWT with

### crit

Critical Header Parameter.

### iss

JWT Issuer

@see [RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)

### sub

JWT Subject

@see [RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)

### aud

JWT Audience

@see [RFC7519#section-4.1.3](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3)

### jti

JWT ID

@see [RFC7519#section-4.1.7](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)

### nbf

JWT Not Before. Defines the time before which the JWT MUST NOT be accepted for processing.
Can be a string (e.g., "2h", "10m") or a number (Unix timestamp in seconds).
A default nbf can be set during plugin initialization.
This default can be overridden dynamically by passing an nbf property (string or number) in the payload object to the jwt.sign() method.

@see [RFC7519#section-4.1.5](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)

### exp

JWT Expiration Time. Defines the expiration time on or after which the JWT MUST NOT be accepted for processing.
Can be a string (e.g., "30d", "1h", "60s") or a number (Unix timestamp in seconds).
A default exp can be set during plugin initialization.
This default can be overridden dynamically by passing an exp property (string or number) in the payload object to the jwt.sign() method.

@see [RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)

### iat

JWT Issued At

@see [RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)
