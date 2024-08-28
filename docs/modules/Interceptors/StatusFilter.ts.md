---
title: Interceptors/StatusFilter.ts
nav_order: 12
parent: Modules
---

## StatusFilter overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [interceptor](#interceptor)
  - [Status](#status)
  - [StatusOK](#statusok)

---

# interceptor

## Status

**Signature**

```ts
export declare const Status: (
  fn: (status: number) => boolean
) => (chain: Chain) => Promise<Either<StatusError | HttpError | InterceptorError, Response>>
```

Added in v0.0.1

## StatusOK

**Signature**

```ts
export declare const StatusOK: (chain: Chain) => Promise<Either<StatusError | HttpError | InterceptorError, Response>>
```

Added in v0.0.1
