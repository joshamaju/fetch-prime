/**
 * @since 0.3.0
 */
import * as core from "./internal/body.js";

/** @internal */
interface Base {
  readonly _id: string;
  readonly _tag: string;
  readonly headers?: Record<string, string>;
}

/**
 * @since 0.3.0
 * @category model
 */
export interface Text extends Base {
  readonly _id: "Text";
  readonly value: string;
}

/**
 * @since 0.3.0
 * @category model
 */
export interface Form extends Base {
  readonly _id: "Form";
  readonly value: FormData;
}

/**
 * @since 0.3.0
 * @category model
 */
export interface Json extends Text {}

/**
 * @since 0.3.0
 * @category model
 */
export type Body = Text | Json | Form;

export const text: (input: string) => Text = core.text;

export const json: (input: object) => Json = core.json;

export const form: (
  input: FormData | Record<string, string | Array<unknown>>
) => Form = core.form;
