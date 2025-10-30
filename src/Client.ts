/**
 * @since 0.1.0
 */
import { Either } from "fp-ts/Either";
import { StatusError } from "./Error.js";
import { Adapter, RequestInit } from "./Fetch.js";
import { Interceptors } from "./Interceptor.js";
import { TimeoutError } from "./Interceptors/Timeout.js";
import { Body } from "./internal/body.js";
import * as core from "./internal/client.js";
import { DecodeError, HttpError } from "./internal/error.js";
import { HttpRequest } from "./internal/request.js";
import { ResponseEither } from "./Response.js";

/**
 * @since 0.2.0
 * @category model
 */
export type Config<E, R> = {
  url?: string;
  adapter: Adapter;
  timeout?: number;
  interceptors?: Interceptors<E, R>;
};

/**
 * @since 0.2.0
 * @category model
 */
export type Handler<E> = (
  url: string | URL | HttpRequest,
  init?:
    | RequestInit
    | (Omit<RequestInit, "body"> & { body?: Body | BodyInit })
    | Body
    | undefined
) => Promise<ResponseEither<E | StatusError>>;

/**
 * @since 0.2.0
 * @category model
 */
export interface Instance<E> {
  (url: string | URL | HttpRequest, init?: RequestInit | undefined): Promise<
    Either<E | StatusError, Response>
  >;

  get: Handler<E>;
  put: Handler<E>;
  post: Handler<E>;
  head: Handler<E>;
  patch: Handler<E>;
  delete: Handler<E>;
  options: Handler<E>;
}

/**
 * @since 0.1.0
 * @category constructor
 */
export const create: {
  <E = HttpError, R = never>(
    config: Config<E, R> & Omit<Config<E, R>, "timeout"> & { timeout: number }
  ): Instance<E | TimeoutError>;
  <E = HttpError, R = never>(config: Config<E, R>): Instance<E>;
} = core.create as any;
