import { isLeft, left, right, type Either } from "fp-ts/Either";
import type { Reader } from "fp-ts/Reader";

import type { Fetch, Init } from "../Fetch.js";
import type { Chain, Interceptor, Interceptors } from "../Interceptor.js";
import { prepare } from "./body.js";
import { TaggedError, type HttpError } from "./error.js";
import { HttpRequest } from "./request.js";
import { neverThrow } from "./function.js";

export class InterceptorError extends TaggedError {
  readonly _tag = "InterceptorError";
  constructor(
    readonly name: string,
    readonly index: number,
    opts: Parameters<typeof Error>[1]
  ) {
    super("InterceptorError", opts);
  }
}

export function compose(
  initiator: Reader<Chain, Promise<Either<any, Response>>>
) {
  return <E, R>(interceptors: Interceptors<E, R>) =>
    (request: HttpRequest) => {
      let index = -1;

      function dispatch(
        i: number,
        request: HttpRequest
      ): Promise<Either<E | HttpError | InterceptorError, Response>> {
        if (i <= index) {
          throw new Error("proceed() called multiple times");
        }

        index = i;

        let handler = interceptors[i];

        if (!handler || i === interceptors.length) {
          handler = initiator as Interceptor<E, R>;
        }

        const chain: Chain = {
          request,
          // @ts-expect-error
          proceed: (req) => dispatch(i + 1, req),
        };

        return handler(chain).catch((e) => {
          return left(
            handler == initiator
              ? e
              : new InterceptorError(handler.name, i, { cause: e })
          );
        });
      }

      return dispatch(0, request);
    };
}

export const make = <E, R>(interceptors: Interceptors<E, R>) => {
  return function (fetch: Fetch<HttpError>) {
    return (
      url: string | URL,
      init?: Init
    ): Promise<Either<E | HttpError | InterceptorError, Response>> => {
      const fn = compose(
        async ({ request }): Promise<Either<HttpError, Response>> => {
          const response = await neverThrow(fetch)(request.url, request.init);

          if ("_tag" in response) {
            if (isLeft(response)) throw response.left;
            return response;
          }

          return right(response);
        }
      );

      return fn(interceptors)(new HttpRequest(url, prepare(init)));
    };
  };
};

export const of = <E, R>(
  interceptor: Interceptor<E, R>
): Interceptors<E, R> => [interceptor];

export const empty = (): Interceptors<never, never> => [];

export const add = <T extends Interceptor<any, any>, E, R>(
  interceptors: Interceptors<E, R>,
  interceptor: T
) => {
  return [...interceptors, interceptor];
};

export const copy = <E, R>(interceptors: Interceptors<E, R>) => {
  return [...interceptors];
};
