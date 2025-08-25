/**
 * @since 0.0.1
 */
import type { Either } from "fp-ts/Either";

import { HttpError } from "./internal/error.js";
import * as core from "./internal/fetch.js";
import { HttpRequest } from "./internal/request.js";
import { HttpResponseEither } from "./internal/response/index.js";
import { Body } from "./internal/body.js";

/**
 * @since 0.0.1
 * @category model
 */
export type Init =
  | RequestInit
  | (Omit<RequestInit, "body"> & { body?: Body | BodyInit })
  | Body;

/**
 * @since 0.0.1
 * @category model
 */
export interface Adapter {
  (
    url: string | URL | HttpRequest,
    init?: RequestInit,
  ): Promise<Either<HttpError, Response>>;
}

/**
 * @since 0.0.1
 * @category model
 */
export type Fetch<E> = (
  ...args: Parameters<Adapter>
) => Promise<Either<E | HttpError, Response>>;

/**
 * @since 0.0.1
 * @category constructor
 */
export const fetch_: <E>(
  fetch: Fetch<E>,
) => (
  url: string | URL,
  init?: RequestInit | undefined,
) => Promise<Either<E | HttpError, Response>> = core.raw;

/**
 * @since 0.0.1
 * @category constructor
 */
export const fetch: <E>(
  fetch: Fetch<E>,
) => (
  url: string | URL,
  init?: RequestInit,
) => Promise<HttpResponseEither<E | HttpError>> = core.fetch;
