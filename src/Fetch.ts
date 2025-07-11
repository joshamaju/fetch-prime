/**
 * @since 0.0.1
 */

import { Body } from "./Body.js";
import { HttpError } from "./internal/error.js";
import { HttpRequest } from "./internal/request.js";
import { HttpResponse } from "./internal/response/index.js";

export {
  /**
   * @since 0.0.1
   * @category model
   */
  HttpRequest,

  /**
   * @since 0.0.1
   * @category model
   */
  HttpResponse,
};

/**
 * @since 0.0.1
 * @category model
 */
export type Init =
  | RequestInit
  | (Omit<RequestInit, "body"> & { body?: Body | BodyInit })
  | Body
  | undefined;

/**
 * @since 0.0.1
 * @category model
 */
export interface Adapter {
  (url: string | URL, init?: Init): Promise<HttpResponse<HttpError>>;
}

/**
 * @since 0.0.1
 * @category model
 */
export type Fetch<E> = (
  ...args: Parameters<Adapter>
) => Promise<HttpResponse<E | HttpError>>;

export namespace Adapter {
  export type url = string | URL;
  export type init = Init | undefined;

  export type t = (
    url: string | URL,
    init?: Init
  ) => Promise<HttpResponse<HttpError>>;
}
