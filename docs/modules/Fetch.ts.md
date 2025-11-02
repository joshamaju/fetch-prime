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
  - [fetch\_](#fetch_)
- [model](#model)
  - [Adapter (interface)](#adapter-interface)
  - [Fetch (type alias)](#fetch-type-alias)
  - [Init (type alias)](#init-type-alias)

---

# constructor

## fetch

**Signature**

```ts
export declare const fetch: <E>(
  fetch: Fetch<E>
) => (url: string | URL, init?: RequestInit | undefined) => Promise<Either<HttpError | E, Response>>
```

Added in v0.0.1

## fetch\_

**Signature**

```ts
export declare const fetch_: <E>(
  fetch: Fetch<E>
) => (url: string | URL, init?: RequestInit) => Promise<HttpResponseEither<HttpError | E>>
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

## Init (type alias)

**Signature**

```ts
export type Init = RequestInit | (Omit<RequestInit, "body"> & { body?: Body | BodyInit }) | Body
```

Added in v0.0.1
