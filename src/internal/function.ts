import { isLeft, Either } from "fp-ts/Either";

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
