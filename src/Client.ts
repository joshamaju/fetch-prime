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

export type DecodeType = "json" | "text" | "blob" | "unset" | "auto";

export type Decoded = {
  _tag: "Decode";
  status: number;
  headers: Headers;
  statusText: string;
};

export type DecodeLeft = Decoded & {
  _id: "Err";
  error: DecodeError;
};

export type DecodeRight<A = any> = Decoded & {
  _id: "Ok";
  data: A;
};

/**
 * @since 0.2.0
 * @category model
 */
export type Config<E, R> = {
  url?: string;
  adapter: Adapter;
  timeout?: number;
  responseType?: DecodeType;
  interceptors?: Interceptors<E, R>;
};

type Unwrap<T, E> = T extends "text"
  ? Either<Exclude<E, HttpError> | DecodeLeft, DecodeRight<string>>
  : T extends "blob"
  ? Either<Exclude<E, HttpError> | DecodeLeft, DecodeRight<Blob>>
  : T extends "unset"
  ? ResponseEither<E | StatusError>
  : Either<Exclude<E, HttpError> | DecodeLeft, DecodeRight<any>>;

/**
 * @since 0.2.0
 * @category model
 */
export type Handler<E, C extends Config<any, any>> = <
  I extends RequestInit & { responseType?: DecodeType }
>(
  url: string | URL | HttpRequest,
  init?: I | (Omit<I, "body"> & { body?: Body | BodyInit }) | Body | undefined
) => Promise<
  I["responseType"] extends DecodeType
    ? Unwrap<I["responseType"], E>
    : C["responseType"] extends DecodeType
    ? Unwrap<C["responseType"], E>
    : ResponseEither<E | StatusError>
>;

/**
 * @since 0.2.0
 * @category model
 */
export interface Instance<C extends Config<any, any>, E> {
  (url: string | URL | HttpRequest, init?: RequestInit | undefined): Promise<
    Either<E | StatusError, Response>
  >;

  get: Handler<E, C>;
  put: Handler<E, C>;
  post: Handler<E, C>;
  head: Handler<E, C>;
  patch: Handler<E, C>;
  delete: Handler<E, C>;
  options: Handler<E, C>;
}

/**
 * @since 0.1.0
 * @category constructor
 */
export const create: {
  <
    E = HttpError,
    R = never,
    C extends Config<E, R> = Config<E, R> &
      Omit<Config<E, R>, "timeout"> & { timeout: number }
  >(
    config: C
  ): Instance<C, E | TimeoutError>;
  <E = HttpError, R = never, C extends Config<E, R> = Config<E, R>>(
    config: Config<E, R>
  ): Instance<C, E>;
} = core.create as any;
