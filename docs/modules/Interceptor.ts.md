---
title: Interceptor.ts
nav_order: 8
parent: Modules
---

## Interceptor overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [combinator](#combinator)
  - [add](#add)
- [constructor](#constructor)
  - [copy](#copy)
  - [empty](#empty)
  - [make](#make)
  - [of](#of)
- [model](#model)
  - [Chain (interface)](#chain-interface)
  - [Interceptor (interface)](#interceptor-interface)
  - [InterceptorError](#interceptorerror)
  - [Interceptors (type alias)](#interceptors-type-alias)

---

# combinator

## add

**Signature**

```ts
export declare const add: {
  <T extends Interceptor<any, any>>(
    interceptor: T
  ): <E, R>(
    interceptors: Interceptors<E, R>
  ) => T extends Interceptor<infer R2, infer E2> ? Interceptors<E | R2, R | E2> : never
  <T extends Interceptor<any, any>, E, R>(
    interceptors: Interceptors<E, R>,
    interceptor: T
  ): T extends Interceptor<infer R2, infer E2> ? Interceptors<E | R2, R | E2> : never
}
```

Added in v0.0.1

# constructor

## copy

**Signature**

```ts
export declare const copy: <E, R>(interceptors: Interceptors<E, R>) => Interceptors<E, R>
```

Added in v0.0.1

## empty

**Signature**

```ts
export declare const empty: () => Interceptors<never, never>
```

Added in v0.0.1

## make

**Signature**

```ts
export declare const make: <E, R>(
  interceptors: Interceptors<E, R>
) => (fetch: Fetch<HttpError>) => Fetch<E | HttpError | core.InterceptorError>
```

Added in v0.0.1

## of

**Signature**

```ts
export declare const of: <E, R>(interceptor: Interceptor<E, R>) => Interceptors<E, R>
```

Added in v0.0.1

# model

## Chain (interface)

**Signature**

```ts
export interface Chain {
  request: HttpRequest
  proceed: NextFunction
}
```

Added in v0.0.1

## Interceptor (interface)

**Signature**

```ts
export interface Interceptor<E, R> extends Reader<R | Chain, Promise<Either<E, Response>>> {}
```

Added in v0.0.1

## InterceptorError

**Signature**

```ts
export declare const InterceptorError: typeof core.InterceptorError
```

Added in v0.0.1

## Interceptors (type alias)

**Signature**

```ts
export type Interceptors<E, R> = Array<Interceptor<E, R>>
```

Added in v0.0.1
