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
  - [delete](#delete)
  - [get](#get)
  - [head](#head)
  - [options](#options)
  - [patch](#patch)
  - [post](#post)
  - [put](#put)

---

# constructor

## create

**Signature**

```ts
export declare const create: {
  <E = never, R = never>(
    config: Config<E, R> & Omit<Config<E, R>, "timeout"> & { timeout: number }
  ): Fetch<HttpError | E | TimeoutError>
  <E = never, R = never>(config: Config<E, R>): Fetch<HttpError | E>
}
```

Added in v0.0.1

## delete

**Signature**

```ts
export declare const delete: Handler
```

Added in v0.0.1

## get

**Signature**

```ts
export declare const get: Handler
```

Added in v0.0.1

## head

**Signature**

```ts
export declare const head: Handler
```

Added in v0.0.1

## options

**Signature**

```ts
export declare const options: Handler
```

Added in v0.0.1

## patch

**Signature**

```ts
export declare const patch: Handler
```

Added in v0.0.1

## post

**Signature**

```ts
export declare const post: Handler
```

Added in v0.0.1

## put

**Signature**

```ts
export declare const put: Handler
```

Added in v0.0.1
