---
title: Body.ts
nav_order: 2
parent: Modules
---

## Body overview

Added in v0.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [encoder](#encoder)
  - [form](#form)
  - [json](#json)
  - [text](#text)
- [model](#model)
  - [Body (type alias)](#body-type-alias)
  - [Form (interface)](#form-interface)
  - [Json (interface)](#json-interface)
  - [Text (interface)](#text-interface)

---

# encoder

## form

**Signature**

```ts
export declare const form: (input: FormData | Record<string, string | Array<unknown>>) => Form
```

Added in v0.3.0

## json

**Signature**

```ts
export declare const json: (input: object) => Json
```

Added in v0.3.0

## text

**Signature**

```ts
export declare const text: (input: string) => Text
```

Added in v0.3.0

# model

## Body (type alias)

**Signature**

```ts
export type Body = Text | Json | Form
```

Added in v0.3.0

## Form (interface)

**Signature**

```ts
export interface Form extends Base {
  readonly _id: "Form"
  readonly value: FormData
}
```

Added in v0.3.0

## Json (interface)

**Signature**

```ts
export interface Json extends Text {}
```

Added in v0.3.0

## Text (interface)

**Signature**

```ts
export interface Text extends Base {
  readonly _id: "Text"
  readonly value: string
}
```

Added in v0.3.0
