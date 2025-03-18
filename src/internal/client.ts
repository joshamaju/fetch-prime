import { chainW, map } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { Config } from "../Client.js";
import type { Interceptor, Interceptors, Merge } from "../Interceptor.js";
import { add, copy, empty, make as makeInterceptor } from "../Interceptor.js";
import { Body, isBody } from "./body.js";
import {
  filterStatusOk,
  HttpResponse,
  ResponseEither,
} from "./response/index.js";

import Timeout from "../Interceptors/Timeout.js";
import BaseURL from "../Interceptors/Url.js";
import { HttpRequest } from "./request.js";

type Method = NonNullable<RequestInit["method"]>;

type MaybeMerge<I extends Interceptors<any, any>, T> = T extends Interceptor<
  any,
  any
>
  ? Merge<I, T>
  : I;

export const create = <E, R>({
  url,
  timeout,
  adapter,
  // @ts-expect-error
  interceptors = empty(),
}: Config<E, R>) => {
  const clone = copy(interceptors);
  const baseurl_interceptor = url ? BaseURL(url) : null;

  const timeout_interceptor =
    typeof timeout !== "undefined" ? Timeout(timeout) : null;

  type Interceptors = MaybeMerge<
    MaybeMerge<typeof clone, typeof baseurl_interceptor>,
    typeof timeout_interceptor
  >;

  let interceptors_ = baseurl_interceptor
    ? ([baseurl_interceptor, ...clone] as Interceptors)
    : clone;

  if (timeout_interceptor) {
    interceptors_ = add(interceptors_, timeout_interceptor);
  }

  const adapter_ =
    interceptors_.length <= 0
      ? adapter
      : makeInterceptor(interceptors_)(adapter);

  const fn = async (
    url: string | URL | HttpRequest,
    init?: RequestInit | undefined
  ) => {
    const res = await adapter_(url, init);
    return pipe(res, chainW(filterStatusOk));
  };

  const method = (method: Method) => {
    return async (
      url: string | URL | HttpRequest,
      init?:
        | RequestInit
        | (Omit<RequestInit, "body"> & { body?: Body | BodyInit })
        | Body
        | undefined
    ) => {
      let body: RequestInit["body"];
      let headers: RequestInit["headers"];

      if (isBody(init)) {
        body = init.value;
        if (init.headers) headers = init.headers;
      } else {
        let local_body = init?.body;
        let local_headers = init?.headers;

        if (local_body && isBody(local_body)) {
          const body = local_body;

          if (local_headers) {
            const headers = new Headers(local_headers);

            for (const key in body.headers) {
              headers.set(key, body.headers[key]);
            }

            local_headers = headers;
          } else {
            local_headers = body.headers;
          }

          local_body = body.value;
        }

        body = local_body;
        headers = local_headers;
      }

      const res = await fn(url, { ...init, body, method, headers });

      return new ResponseEither(
        pipe(
          res,
          chainW(filterStatusOk),
          map((res) => new HttpResponse(res))
        )
      );
    };
  };

  const helpers = {
    get: method("GET"),
    put: method("PUT"),
    post: method("POST"),
    head: method("HEAD"),
    patch: method("PATCH"),
    delete: method("DELETE"),
    options: method("OPTIONS"),
  };

  Object.assign(fn, helpers);

  return fn;
};
