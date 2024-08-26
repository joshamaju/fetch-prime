/**
 * @since 0.0.1
 */
import { Either } from "fp-ts/Either";

import * as core from "./internal/function.js";
import { dual } from "./internal/utils.js";

/**
 * @since 0.0.1
 * @category combinator
 */
export const chain: {
  <E1, A, B>(fn: (res: A) => Promise<Either<E1, B>>): <E>(
    response: Either<E, A>
  ) => Promise<Either<E | E1, B>>;
  <E, A, E1, B>(
    response: Either<E, A>,
    fn: (res: A) => Promise<Either<E1, B>>
  ): Promise<Either<E | E1, B>>;
} = dual(2, (response, fn) => core.chain(response, fn));
