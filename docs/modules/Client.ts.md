---
title: Client.ts
nav_order: 3
parent: Modules
---

## Client overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructor](#constructor)
  - [create](#create)
- [model](#model)
  - [Config (type alias)](#config-type-alias)
  - [Handler (type alias)](#handler-type-alias)
  - [Instance (interface)](#instance-interface)

---

# constructor

## create

**Signature**

```ts
export declare const create: {
  <E = HttpError, R = never>(
    config: Config<E, R> & Omit<Config<E, R>, "timeout"> & { timeout: number }
  ): Instance<E | TimeoutError>
  <E = HttpError, R = never>(config: Config<E, R>): Instance<E>
}
```

Added in v0.1.0

# model

## Config (type alias)

**Signature**

```ts
export type Config<E, R> = {
  url?: string
  adapter: Adapter
  timeout?: number
  interceptors?: Interceptors<E, R>
}
```

Added in v0.2.0

## Handler (type alias)

**Signature**

```ts
export type Handler<E> = (
  url: string | URL | HttpRequest,
  init?: RequestInit | (Omit<RequestInit, "body"> & { body?: Body | BodyInit }) | Body | undefined
) => Promise<ResponseEither<E | StatusError>>
```

Added in v0.2.0

## Instance (interface)

**Signature**

```ts
export interface Instance<E> {
  (url: string | URL | HttpRequest, init?: RequestInit | undefined): Promise<Either<E | StatusError, Response>>

  get: Handler<E>
  put: Handler<E>
  post: Handler<E>
  head: Handler<E>
  patch: Handler<E>
  delete: Handler<E>
  options: Handler<E>
}
```

Added in v0.2.0
