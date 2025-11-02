/**
 * @since 0.0.1
 */
import { Either } from "fp-ts/Either";

import { dual } from "./internal/utils.js";
import { DecodeError } from "./internal/error.js";
import * as core from "./internal/response/index.js";
import {
  HttpResponse,
  ResponseT,
  StatusError,
  StatusErrorT,
} from "./internal/response/index.js";
import { StatusNotOK, StatusOK } from "./internal/response/types.js";

export {
  /**
   * @since 0.0.1
   * @category status code
   */
  StatusCode,
  /**
   * @since 0.0.1
   * @category status code
   */
  StatusNotOK,
  /**
   * @since 0.0.1
   * @category status code
   */
  StatusOK,
} from "./internal/response/types.js";

export {
  /**
   * @since 0.0.1
   * @category model
   */
  StatusError,

  /**
   * @since 0.0.1
   * @category model
   */
  StatusErrorT,
} from "./internal/response/index.js";

export {
  /**
   * @since 0.0.1
   * @category model
   */
  HttpResponse,

  /**
   * @since 0.1.0
   * @category model
   */
  HttpResponseEither,
} from "./internal/response/index.js";

/**
 * @since 0.0.1
 * @category decoder
 */
export const json: (arg: Response) => Promise<Either<DecodeError, any>> =
  core.json;

/**
 * @since 0.0.1
 * @category decoder
 */
export const text: (arg: Response) => Promise<Either<DecodeError, string>> =
  core.text;

/**
 * @since 0.0.1
 * @category decoder
 */
export const blob: (arg: Response) => Promise<Either<DecodeError, Blob>> =
  core.blob;

/**
 * @since 0.0.1
 * @category decoder
 */
export const formData: (
  arg: Response
) => Promise<Either<DecodeError, FormData>> = core.formData;

/**
 * @since 0.0.1
 * @category decoder
 */
export const arrayBuffer: (
  arg: Response
) => Promise<Either<DecodeError, ArrayBuffer>> = core.arrayBuffer;

/**
 * @since 0.0.1
 * @category filtering
 */
export const filterStatusOk: <R extends Response | HttpResponse>(
  response: R
) => Either<StatusError, R> = core.filterStatusOk;

/**
 * @since 0.0.1
 * @category filtering
 */
export const filterStatusOkT: (
  response: Response
) => Either<StatusErrorT<StatusNotOK>, ResponseT<StatusOK>> =
  core.filterStatusOkT;

/**
 * @since 0.0.1
 * @category filtering
 */
export const filterStatus = dual<
  (
    fn: (status: number) => boolean
  ) => (response: Response) => Either<StatusError, Response>,
  (
    response: Response,
    fn: (status: number) => boolean
  ) => Either<StatusError, Response>
>(2, (r, f) => core.filterStatus(r, f));
