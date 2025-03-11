/**
 * @since 0.0.1
 */

import { Either } from "fp-ts/Either";

import { StatusError } from "./Error.js";
import { Adapter } from "./Fetch.js";
import { Interceptors } from "./Interceptor.js";
import { TimeoutError } from "./Interceptors/Timeout.js";
import { Body } from "./internal/body.js";
import * as core from "./internal/client.js";
import { HttpError } from "./internal/error.js";
import { HttpRequest } from "./internal/request.js";

/** @internal */
export type Config<E, R> = {
  url?: string;
  adapter: Adapter;
  timeout?: number;
  interceptors?: Interceptors<E, R>;
};

/** @internal */
export type Handler<E> = (
  url: string | URL | HttpRequest,
  init?:
    | RequestInit
    | (Omit<RequestInit, "body"> & { body?: Body | BodyInit })
    | Body
    | undefined
) => Promise<Either<E | StatusError, Response>>;

/**
 * @since 0.1.0
 * @category constructor
 */
export const create: {
  <E = HttpError, R = never>(
    config: Config<E, R> & Omit<Config<E, R>, "timeout"> & { timeout: number }
  ): {
    get: Handler<E | TimeoutError>;
    put: Handler<E | TimeoutError>;
    post: Handler<E | TimeoutError>;
    head: Handler<E | TimeoutError>;
    patch: Handler<E | TimeoutError>;
    delete: Handler<E | TimeoutError>;
    options: Handler<E | TimeoutError>;
  };
  <E = HttpError, R = never>(config: Config<E, R>): {
    get: Handler<E>;
    put: Handler<E>;
    post: Handler<E>;
    head: Handler<E>;
    patch: Handler<E>;
    delete: Handler<E>;
    options: Handler<E>;
  };
} = core.create;
