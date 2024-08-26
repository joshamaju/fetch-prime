/**
 * @since 0.0.1
 */
import { Either } from "fp-ts/Either";

import { DecodeError } from "./internal/error.js";
import * as core from "./internal/request.js";

export {
  /**
   * @since 0.0.1
   * @category model
   */
  HttpRequest,
} from "./internal/request.js";

/**
 * @since 0.0.1
 * @category decoder
 */
export const json: (arg: Request) => Promise<Either<DecodeError, any>> =
  core.json;

/**
 * @since 0.0.1
 * @category decoder
 */
export const text: (arg: Request) => Promise<Either<DecodeError, string>> =
  core.text;

/**
 * @since 0.0.1
 * @category decoder
 */
export const blob: (arg: Request) => Promise<Either<DecodeError, Blob>> =
  core.blob;

/**
 * @since 0.0.1
 * @category decoder
 */
export const formData: (
  arg: Request
) => Promise<Either<DecodeError, FormData>> = core.formData;

/**
 * @since 0.0.1
 * @category decoder
 */
export const arrayBuffer: (
  arg: Request
) => Promise<Either<DecodeError, ArrayBuffer>> = core.arrayBuffer;
