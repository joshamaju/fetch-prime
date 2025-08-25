import { chain } from "fp-ts/Either";

import { Client, Config, Handler } from "../Client.js";
import type { Interceptor, Interceptors, Merge } from "../Interceptor.js";
import { add, copy, empty, make as makeInterceptor } from "../Interceptor.js";
import { filterStatusOk } from "./response/index.js";
import { prepare } from "./body.js";

import Timeout from "../Interceptors/Timeout.js";
import BaseURL from "../Interceptors/Url.js";
import ConfigInterceptor from "../Interceptors/Config.js";

type Method = NonNullable<RequestInit["method"]>;

const method = (method: Method): Handler => {
  return (fetch) => {
    return async (url, init) => {
      const init_ = init ? prepare(init) : undefined;
      const res = await fetch(url, { ...init_, method });
      return chain(filterStatusOk)(res);
    };
  };
};

const get = method("GET");

const put = method("PUT");

const post = method("POST");

const head = method("HEAD");

const patch = method("PATCH");

const delete_ = method("DELETE");

const options = method("OPTIONS");

type MaybeMerge<I extends Interceptors<any, any>, T> =
  T extends Interceptor<any, any> ? Merge<I, T> : I;

export const create = <E, R>({
  url,
  headers,
  timeout,
  adapter,
  // @ts-expect-error
  interceptors = empty(),
}: Config<E, R>): Client<E> => {
  const clone = copy(interceptors);
  const baseurl_interceptor = url ? BaseURL(url) : null;

  const timeout_interceptor =
    typeof timeout !== "undefined" ? Timeout(timeout) : null;

  const config_interceptor =
    typeof headers !== "undefined" ? ConfigInterceptor({ headers }) : null;

  type Interceptors = MaybeMerge<
    MaybeMerge<
      MaybeMerge<typeof clone, typeof baseurl_interceptor>,
      typeof timeout_interceptor
    >,
    typeof config_interceptor
  >;

  let interceptors_ = baseurl_interceptor
    ? ([baseurl_interceptor, ...clone] as Interceptors)
    : clone;

  if (config_interceptor) {
    interceptors_ = add(interceptors_, config_interceptor);
  }

  if (timeout_interceptor) {
    interceptors_ = add(interceptors_, timeout_interceptor);
  }

  const adapter_ =
    interceptors_.length <= 0
      ? adapter
      : makeInterceptor(interceptors_)(adapter);

  Object.defineProperties(adapter_, {
    get: { value: get(adapter_) },
    put: { value: put(adapter_) },
    post: { value: post(adapter_) },
    head: { value: head(adapter_) },
    patch: { value: patch(adapter_) },
    delete: { value: delete_(adapter_) },
    options: { value: options(adapter_) },
  });

  // @ts-expect-error
  return adapter_;
};
