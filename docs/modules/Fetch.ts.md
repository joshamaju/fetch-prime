---
title: Fetch.ts
nav_order: 5
parent: Modules
---

## Fetch overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [combinator](#combinator)
  - [map](#map)
- [constructor](#constructor)
  - [fetch](#fetch)
  - [fetch\_](#fetch_)
- [model](#model)
  - [Adapter (interface)](#adapter-interface)
  - [Fetch (type alias)](#fetch-type-alias)

---

# combinator

## map

**Signature**

```ts
export declare const map: <E, A, B, E2 = E>(
  request: (fetch: Fetch<E2>) => Promise<Either<E, A>>,
  fn: (res: Either<E, A>) => B
) => (fetch: Fetch<E2>) => Promise<B>
```

Added in v0.0.1

# constructor

## fetch

**Signature**

```ts
export declare const fetch: (
  url: string | URL,
  init?: RequestInit
) => <E>(fetch: Fetch<E>) => Promise<HttpResponseEither<HttpError | E>>
```

Added in v0.0.1

## fetch\_

**Signature**

```ts
export declare const fetch_: (
  url: string | URL,
  init?: RequestInit | undefined
) => <E>(fetch: Fetch<E>) => Promise<Either<HttpError | E, Response>>
```

Added in v0.0.1

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
