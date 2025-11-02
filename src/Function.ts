/**
 * @since 0.0.1
 */
import { Either } from "fp-ts/Either";

import * as core from "./internal/function.js";
import { dual } from "./internal/utils.js";

/**
 * @since 0.2.0
 * @category combinator
 */
export const andThen: {
  <E1, A, B>(fn: (self: A) => Promise<Either<E1, B>>): <E>(
    response: Either<E, A>
  ) => Promise<Either<E | E1, B>>;
  <E, A, E1, B>(
    response: Either<E, A>,
    fn: (self: A) => Promise<Either<E1, B>>
  ): Promise<Either<E | E1, B>>;

  <E1, A, B>(fn: (self: A) => Either<E1, B>): <E>(
    response: Either<E, A>
  ) => Either<E | E1, B>;
  <E, A, E1, B>(response: Either<E, A>, fn: (self: A) => Either<E1, B>): Either<
    E | E1,
    B
  >;

  <A, B>(fn: (self: A) => B): <E>(response: Either<E, A>) => Either<E, B>;
  <E, A, B>(response: Either<E, A>, fn: (self: A) => B): Either<E, B>;
} = dual(2, (response, fn) => core.andThen(response, fn));

/**
 * @since 0.3.0
 * @category combinator
 * @example fetch(url("https://reqres.in/api/users/{id}", { id: 2 }))
 */
export const url: (template: string, variables: object) => string = core.url;
