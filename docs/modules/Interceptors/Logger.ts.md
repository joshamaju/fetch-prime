---
title: Interceptors/Logger.ts
nav_order: 11
parent: Modules
---

## Logger overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [interceptor](#interceptor)
  - [Logger](#logger)

---

# interceptor

## Logger

**Signature**

```ts
export declare const Logger: (
  level: Level,
  headersToRedact?: string[]
) => (context: Interceptor.Chain) => Promise<E.Either<HttpError | Interceptor.InterceptorError, Response>>
```

Added in v0.0.1
