/**
 * @since 0.0.1
 */
import type { Either } from "fp-ts/Either";

import { HttpError } from "./internal/error.js";
import * as core from "./internal/fetch.js";
import { HttpRequest } from "./internal/request.js";
import { ResponseEither } from "./internal/response/index.js";

/**
 * @since 0.2.0
 * @category model
 */
export interface RequestInit extends globalThis.RequestInit {}

/**
 * @since 0.0.1
 * @category model
 */
export interface Adapter {
  (url: string | URL | HttpRequest, init?: RequestInit): Promise<
    Either<HttpError, Response>
  >;
}

/**
 * @since 0.0.1
 * @category model
 */
export type Fetch<E> = (
  ...args: Parameters<Adapter>
) => Promise<Either<E | HttpError, Response>>;

/**
 * @since 0.1.0
 * @category constructor
 */
export const fetch: <E>(
  fetch: Fetch<E>
) => (
  url: string | URL,
  init?: RequestInit
) => Promise<ResponseEither<E | HttpError>> = core.fetch;
