import {
  chainW,
  Either,
  isLeft,
  left,
  map,
  mapLeft,
  right,
} from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { Config, DecodeType } from "../Client.js";
import type {
  Chain,
  Interceptor,
  Interceptors,
  Merge,
} from "../Interceptor.js";
import { add, copy, empty, make as makeInterceptor } from "../Interceptor.js";
import { Body, isBody } from "./body.js";
import {
  blob,
  filterStatusOk,
  json,
  ResponseEither,
  text,
} from "./response/index.js";

import Timeout from "../Interceptors/Timeout.js";
import BaseURL from "../Interceptors/Url.js";
import { DecodeError, TaggedError } from "./error.js";
import { HttpRequest } from "./request.js";

type Method = NonNullable<RequestInit["method"]>;

type MaybeMerge<I extends Interceptors<any, any>, T> = T extends Interceptor<
  any,
  any
>
  ? Merge<I, T>
  : I;

function isRecord(obj: any): obj is Record<string, string> {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export const create = <E, R>({
  url,
  timeout,
  adapter,
  responseType,
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

  const decoder = async function (chain: Chain) {
    const res = await chain.proceed(chain.request);

    const isTaggedError = () => {};

    if (isLeft(res)) {
      const l = res.left;

      if (
        !("response" in l) ||
        ("response" in l && !(l.response instanceof Response))
      )
        return res;
    }

    let a = res;

    // console.log("here", res);

    const init = chain.request.init;

    // // @ts-expect-error
    // const type = init?.responseType ?? responseType;

    // if (type && type !== "unset") {
    //   const response = isLeft(res) ? res.left.response : res.right;

    //   const status = response.status;
    //   const headers = response.headers;
    //   const statusText = response.statusText;

    //   let result: Either<DecodeError, any>;

    //   switch (type) {
    //     case "text":
    //       result = await text(response);
    //       break;
    //     case "blob":
    //       result = await blob(response);
    //       break;
    //     default:
    //       result = await json(response);
    //   }

    //   const data = { status, headers, statusText };

    //   const n = pipe(
    //     result,
    //     map((data) => ({ ...data, data } as const)),
    //     chainW((_) => (isLeft(res) ? left(_) : right(_))),
    //     mapLeft((error) => ({ ...data, error } as const))
    //   );
    // }
  };

  // // @ts-expect-error
  // interceptors_.unshift(decoder);
  // interceptors_ = add(interceptors_, decoder);

  const adapter_ =
    interceptors_.length <= 0
      ? adapter
      : makeInterceptor(interceptors_)(adapter);

  const fn = async (
    url: string | URL | HttpRequest,
    init?: RequestInit | undefined
  ) => {
    const res = await adapter_(url, init);
    return res;
    // return chainW((_: Response) => filterStatusOk(_))(res);
  };

  type Init = RequestInit & { responseType?: DecodeType };

  const method = (method: Method) => {
    return async (
      url: string | URL | HttpRequest,
      init?:
        | Init
        | (Omit<Init, "body"> & { body?: Body | BodyInit })
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
            const headers = local_headers;

            for (const key in body.headers) {
              if (Array.isArray(headers)) {
                headers.push([key, body.headers[key]]);
              } else if (isRecord(headers)) {
                headers[key] = body.headers[key];
              } else {
                headers.set(key, body.headers[key]);
              }
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

      // const decode_type =
      //   (init && !isBody(init) ? init.responseType : null) ?? responseType;

      // if (decode_type && decode_type !== "unset") {
      //   return res;
      // }

      return new ResponseEither(res);
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
