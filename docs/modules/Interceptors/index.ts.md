---
title: Interceptors/index.ts
nav_order: 10
parent: Modules
---

## index overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [exports](#exports)
  - [From "./Authentication.js"](#from-authenticationjs)
  - [From "./Logger.js"](#from-loggerjs)
  - [From "./StatusFilter.js"](#from-statusfilterjs)
  - [From "./Timeout.js"](#from-timeoutjs)
- [utils](#utils)
  - [Timeout](#timeout)
  - [URL](#url)

---

# exports

## From "./Authentication.js"

Re-exports all named exports from the "./Authentication.js" module as `Authentication`.

**Signature**

```ts
export * as Authentication from "./Authentication.js"
```

Added in v0.0.1

## From "./Logger.js"

Re-exports all named exports from the "./Logger.js" module as `Logger`.

**Signature**

```ts
export * as Logger from "./Logger.js"
```

Added in v0.0.1

## From "./StatusFilter.js"

Re-exports all named exports from the "./StatusFilter.js" module as `StatusFilter`.

**Signature**

```ts
export * as StatusFilter from "./StatusFilter.js"
```

Added in v0.0.1

## From "./Timeout.js"

Re-exports all named exports from the "./Timeout.js" module.

**Signature**

```ts
export * from "./Timeout.js"
```

Added in v0.0.1

# utils

## Timeout

**Signature**

```ts
export declare const Timeout: (
  duration: number
) => (chain: Chain) => Promise<Either<HttpError | InterceptorError | TimeoutError, Response>>
```

Added in v0.0.1

## URL

**Signature**

```ts
export declare const URL: (base: string) => (chain: Chain) => Promise<Either<HttpError | InterceptorError, Response>>
```

Added in v0.0.1
