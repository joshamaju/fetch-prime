/**
 * @since 0.0.1
 */

import { Either } from "fp-ts/Either";

import { StatusError } from "./Error.js";
import { Adapter, Fetch, Init } from "./Fetch.js";
import { InterceptorError, Interceptors } from "./Interceptor.js";
import * as core from "./internal/client.js";
import { HttpError } from "./internal/error.js";
import { HttpRequest } from "./internal/request.js";
import { TimeoutError } from "./Interceptors/Timeout.js";

/** @internal */
export type Config<E, R> = {
  url?: string;
  adapter: Adapter;
  timeout?: number;
  headers?: RequestInit["headers"];
  interceptors?: Interceptors<E, R>;
};

/** @internal */
export type Handler<E = any> = (
  fetch: Fetch<any>,
) => (
  url: string | URL | HttpRequest,
  init?: Init | undefined,
) => Promise<Either<E | StatusError, Response>>;

/**
 * @since 0.0.1
 * @category model
 */
export interface Client<E>
  extends Fetch<E | HttpError>,
    Record<
      "get" | "put" | "post" | "patch" | "head" | "options" | "delete",
      ReturnType<Handler<E>>
    > {}

/**
 * @since 0.0.1
 * @category constructor
 */
export const create: {
  <E = never, R = never>(
    config: Config<E, R> &
      Omit<Config<E, R>, "url" | "headers"> &
      ({ url: string } | { headers: RequestInit["headers"] }),
  ): Client<E | HttpError | InterceptorError>;

  <E = never, R = never>(
    config: Config<E, R> & Omit<Config<E, R>, "timeout"> & { timeout: number },
  ): Client<E | HttpError | TimeoutError | InterceptorError>;

  <E = never, R = never>(config: Config<E, R>): Client<E | HttpError>;
} = core.create;
