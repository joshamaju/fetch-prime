---
title: Response.ts
nav_order: 16
parent: Modules
---

## Response overview

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [decoder](#decoder)
  - [arrayBuffer](#arraybuffer)
  - [blob](#blob)
  - [formData](#formdata)
  - [json](#json)
  - [text](#text)
- [filtering](#filtering)
  - [filterStatus](#filterstatus)
  - [filterStatusOk](#filterstatusok)
  - [filterStatusOkT](#filterstatusokt)
- [model](#model)
  - [HttpResponse](#httpresponse)
  - [HttpResponseEither](#httpresponseeither)
  - [StatusError](#statuserror)
  - [StatusErrorT](#statuserrort)
- [status code](#status-code)
  - [StatusCode](#statuscode)
  - [StatusNotOK](#statusnotok)
  - [StatusOK](#statusok)

---

# decoder

## arrayBuffer

**Signature**

```ts
export declare const arrayBuffer: (arg: Response) => Promise<Either<DecodeError, ArrayBuffer>>
```

Added in v0.0.1

## blob

**Signature**

```ts
export declare const blob: (arg: Response) => Promise<Either<DecodeError, Blob>>
```

Added in v0.0.1

## formData

**Signature**

```ts
export declare const formData: (arg: Response) => Promise<Either<DecodeError, FormData>>
```

Added in v0.0.1

## json

**Signature**

```ts
export declare const json: (arg: Response) => Promise<Either<DecodeError, any>>
```

Added in v0.0.1

## text

**Signature**

```ts
export declare const text: (arg: Response) => Promise<Either<DecodeError, string>>
```

Added in v0.0.1

# filtering

## filterStatus

**Signature**

```ts
export declare const filterStatus: ((
  fn: (status: number) => boolean
) => (response: Response) => Either<StatusError, Response>) &
  ((response: Response, fn: (status: number) => boolean) => Either<StatusError, Response>)
```

Added in v0.0.1

## filterStatusOk

**Signature**

```ts
export declare const filterStatusOk: <R extends Response | core.HttpResponse>(
  response: R
) => Either<core.StatusError, R>
```

Added in v0.0.1

## filterStatusOkT

**Signature**

```ts
export declare const filterStatusOkT: (response: Response) => Either<StatusErrorT<StatusNotOK>, ResponseT<StatusOK>>
```

Added in v0.0.1

# model

## HttpResponse

**Signature**

```ts
export declare const HttpResponse: typeof core.HttpResponse
```

Added in v0.0.1

## HttpResponseEither

**Signature**

```ts
export declare const HttpResponseEither: typeof core.HttpResponseEither
```

Added in v0.1.0

## StatusError

**Signature**

```ts
export declare const StatusError: typeof core.StatusError
```

Added in v0.0.1

## StatusErrorT

**Signature**

```ts
export declare const StatusErrorT: any
```

Added in v0.0.1

# status code

## StatusCode

**Signature**

```ts
export declare const StatusCode: any
```

Added in v0.0.1

## StatusNotOK

**Signature**

```ts
export declare const StatusNotOK: any
```

Added in v0.0.1

## StatusOK

**Signature**

```ts
export declare const StatusOK: any
```

Added in v0.0.1
