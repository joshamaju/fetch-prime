---
title: Client.ts
nav_order: 3
parent: Modules
---

## Client overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [constructor](#constructor)
  - [create](#create)
- [model](#model)
  - [Client (interface)](#client-interface)

---

# constructor

## create

**Signature**

```ts
export declare const create: {
  <E = never, R = never>(
    config: Config<E, R> &
      Omit<Config<E, R>, "url" | "headers"> &
      ({ url: string } | { headers: RequestInit["headers"] })
  ): Client<HttpError | InterceptorError | E>
  <E = never, R = never>(
    config: Config<E, R> & Omit<Config<E, R>, "timeout"> & { timeout: number }
  ): Client<HttpError | InterceptorError | E | TimeoutError>
  <E = never, R = never>(config: Config<E, R>): Client<HttpError | E>
}
```

Added in v0.0.1

# model

## Client (interface)

**Signature**

```ts
export interface Client<E>
  extends Fetch<E | HttpError>,
    Record<"get" | "put" | "post" | "patch" | "head" | "options" | "delete", ReturnType<Handler<E>>> {}
```

Added in v0.0.1
