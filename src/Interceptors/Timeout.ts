/**
 * @since 0.0.1
 */

import { Either } from "fp-ts/Either";

import { Chain } from "../Interceptor.js";
import { HttpRequest } from "../Request.js";

/**
 * @since 0.0.1
 * @category model
 */
export class TimeoutError {
  readonly _tag = "TimeoutError";
  constructor(readonly duration: number) {}
}

const Timeout = (duration: number) => {
  return async (chain: Chain) => {
    const { init, url } = chain.request;

    const parent = init?.signal;

    const controller = new AbortController();
    const signal = controller.signal;

    if (parent) parent.addEventListener("abort", controller.abort);

    const timeout = setTimeout(
      () => controller.abort(new TimeoutError(duration)),
      duration
    );

    const res = await chain.proceed(new HttpRequest(url, { ...init, signal }));

    clearTimeout(timeout);

    type Return = Either<
      Extract<typeof res, { _tag: "Left" }>["left"] | TimeoutError,
      Response
    >;

    return res as Return;
  };
};

/**
 * @since 0.0.1
 * @category interceptor
 */
export default Timeout;
