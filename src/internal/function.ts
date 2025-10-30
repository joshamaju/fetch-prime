import { isLeft, Either } from "fp-ts/Either";
import { HttpResponse } from "./response/index.js";

export const andThen: <E, A, E1>(
  response: Either<E, HttpResponse>,
  fn: (self: HttpResponse) => A | Either<E1, A> | Promise<Either<E1, A>>
) =>
  | A
  | Either<E | E1 | HttpResponse, A>
  | Promise<Either<E | E1 | HttpResponse, A>> = (res, fn) => {
  if (isLeft(res)) return res;
  return fn(res.right);
};
