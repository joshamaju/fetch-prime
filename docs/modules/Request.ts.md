---
title: Request.ts
nav_order: 15
parent: Modules
---

## Request overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [decoder](#decoder)
  - [arrayBuffer](#arraybuffer)
  - [blob](#blob)
  - [formData](#formdata)
  - [json](#json)
  - [text](#text)
- [model](#model)
  - [HttpRequest](#httprequest)

---

# decoder

## arrayBuffer

**Signature**

```ts
export declare const arrayBuffer: (arg: Request) => Promise<Either<DecodeError, ArrayBuffer>>
```

Added in v0.0.1

## blob

**Signature**

```ts
export declare const blob: (arg: Request) => Promise<Either<DecodeError, Blob>>
```

Added in v0.0.1

## formData

**Signature**

```ts
export declare const formData: (arg: Request) => Promise<Either<DecodeError, FormData>>
```

Added in v0.0.1

## json

**Signature**

```ts
export declare const json: (arg: Request) => Promise<Either<DecodeError, any>>
```

Added in v0.0.1

## text

**Signature**

```ts
export declare const text: (arg: Request) => Promise<Either<DecodeError, string>>
```

Added in v0.0.1

# model

## HttpRequest

**Signature**

```ts
export declare const HttpRequest: typeof core.HttpRequest
```

Added in v0.0.1
