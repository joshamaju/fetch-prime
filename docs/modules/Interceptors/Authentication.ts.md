---
title: Interceptors/Authentication.ts
nav_order: 9
parent: Modules
---

## Authentication overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [interceptor](#interceptor)
  - [Basic](#basic)
  - [BearerToken](#bearertoken)

---

# interceptor

## Basic

**Signature**

```ts
export declare const Basic: (
  username: string,
  password: string
) => (chain: Chain) => Promise<Either<HttpError | InterceptorError, Response>>
```

Added in v0.0.1

## BearerToken

**Signature**

```ts
export declare const BearerToken: (
  token: string
) => (chain: Chain) => Promise<Either<HttpError | InterceptorError, Response>>
```

Added in v0.0.1
