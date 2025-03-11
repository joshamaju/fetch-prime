import { isLeft, Either } from "fp-ts/Either";
import { HttpResponse } from "./response/index.js";

// export const map = <E, A, B>(
//   response: Either<E, A>,
//   fn: (res: A) => B
// ): Either<E, B> => {
//   if (isLeft(response)) return response;
//   const result = fn(response.right);
//   return result;
// };

export const andThen = <E, A, E1, B>(
  response: Either<E, A>,
  fn: (res: A) => Either<E1, B> | Promise<Either<E1, B>>
): Either<E | E1, B> | Promise<Either<E | E1, B>> => {
  if (isLeft(response)) return response;
  return fn(response.right);
};

export const flatMap: <E, A, E1>(
  response: Either<E, HttpResponse>,
  fn: (self: HttpResponse) => A | Either<E1, A> | Promise<Either<E1, A>>
) =>
  | A
  | Either<E | E1 | HttpResponse, A>
  | Promise<Either<E | E1 | HttpResponse, A>> = (res, fn) => {
  if (isLeft(res)) return res;
  return fn(res.right);
};
