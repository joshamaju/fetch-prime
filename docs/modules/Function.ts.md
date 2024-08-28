---
title: Function.ts
nav_order: 6
parent: Modules
---

## Function overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [combinator](#combinator)
  - [andThen](#andthen)

---

# combinator

## andThen

**Signature**

```ts
export declare const andThen: {
  <E1, A, B>(fn: (res: A) => Either<E1, B>): <E>(response: Either<E, A>) => Either<E1 | E, B>
  <E, A, E1, B>(response: Either<E, A>, fn: (res: A) => Either<E1, B>): Either<E | E1, B>
  <E1, A, B>(fn: (res: A) => Promise<Either<E1, B>>): <E>(response: Either<E, A>) => Promise<Either<E1 | E, B>>
  <E, A, E1, B>(response: Either<E, A>, fn: (res: A) => Promise<Either<E1, B>>): Promise<Either<E | E1, B>>
}
```

Added in v0.0.1
