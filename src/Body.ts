import { Init } from "./Fetch.js";
import * as core from "./internal/body.js";

interface Base {
  readonly _id: string;
  readonly _tag: string;
  readonly headers?: Record<string, string>;
}

/**
 * @since 0.0.1
 * @category model
 */
export interface Text extends Base {
  readonly _id: "Text";
  readonly value: string;
}

/**
 * @since 0.0.1
 * @category model
 */
export interface Form extends Base {
  readonly _id: "Form";
  readonly value: FormData;
}

/**
 * @since 0.0.1
 * @category model
 */
export interface URLEncoded extends Base {
  readonly _id: "URLEncoded";
  readonly value: string;
}

/**
 * @since 0.0.1
 * @category model
 */
export interface Json extends Text {}

/**
 * @since 0.0.1
 * @category model
 */
export type Body = Text | Json | Form | URLEncoded;

/**
 * @since 0.0.1
 * @category constructor
 */
export const json: (input: object) => Json = core.json;

/**
 * @since 0.0.1
 * @category constructor
 */
export const form: (
  input: FormData | Record<string, string | Array<unknown>>
) => Form = core.form;

/**
 * @since 0.0.1
 * @category constructor
 */
export const text: (input: string) => Text = core.text;

/**
 * @since 0.0.1
 * @category constructor
 */
export const urlencoded: (
  input: Record<string, unknown | Array<unknown>>
) => URLEncoded = core.urlencoded;

/**
 * @since 0.0.1
 * @category utility
 */
export const prepare: (input: Init) => RequestInit = core.prepare;

/**
 * @since 0.0.1
 * @category utility
 */
export const isBody: (input: unknown) => input is Body = core.isBody;
