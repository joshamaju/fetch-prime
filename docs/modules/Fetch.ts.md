---
title: Fetch.ts
nav_order: 5
parent: Modules
---

## Fetch overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [constructor](#constructor)
  - [fetch](#fetch)
- [model](#model)
  - [Adapter (interface)](#adapter-interface)
  - [Fetch (type alias)](#fetch-type-alias)
  - [RequestInit (interface)](#requestinit-interface)

---

# constructor

## fetch

**Signature**

```ts
export declare const fetch: <E>(
  fetch: Fetch<E>
) => (url: string | URL, init?: RequestInit) => Promise<ResponseEither<HttpError | E>>
```

Added in v0.1.0

# model

## Adapter (interface)

**Signature**

```ts
export interface Adapter {
  (url: string | URL | HttpRequest, init?: RequestInit): Promise<Either<HttpError, Response>>
}
```

Added in v0.0.1

## Fetch (type alias)

**Signature**

```ts
export type Fetch<E> = (...args: Parameters<Adapter>) => Promise<Either<E | HttpError, Response>>
```

Added in v0.0.1

## RequestInit (interface)

**Signature**

```ts
export interface RequestInit extends globalThis.RequestInit {}
```

Added in v0.2.0
