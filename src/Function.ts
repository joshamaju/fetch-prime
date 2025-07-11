/**
 * @since 0.0.1
 */
import { Either, isLeft, left, right } from "fp-ts/Either";

import * as core from "./internal/function.js";
import { dual } from "./internal/utils.js";
import { Adapter } from "./Fetch.js";
import { HttpError } from "./Error.js";

/**
 * @since 0.0.1
 * @category combinator
 */
export const andThen: {
  <E1, A, B>(fn: (res: A) => Either<E1, B>): <E>(
    response: Either<E, A>
  ) => Either<E | E1, B>;

  <E, A, E1, B>(response: Either<E, A>, fn: (res: A) => Either<E1, B>): Either<
    E | E1,
    B
  >;

  <E1, A, B>(fn: (res: A) => Promise<Either<E1, B>>): <E>(
    response: Either<E, A>
  ) => Promise<Either<E | E1, B>>;

  <E, A, E1, B>(
    response: Either<E, A>,
    fn: (res: A) => Promise<Either<E1, B>>
  ): Promise<Either<E | E1, B>>;
} = dual(2, (response, fn) => core.andThen(response, fn));

/**
 * @since 0.0.1
 * @category combinator
 */
export const url: (template: string, variables: object) => string = core.url;

/**
 * @since 0.0.1
 * @category combinator
 */
export const neverThrow: (adapter: Adapter) => Adapter = core.neverThrow;
