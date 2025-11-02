import { Either, isLeft } from "fp-ts/Either";

export const andThen = <E, A, E1, B>(
  response: Either<E, A>,
  fn: (res: A) => Either<E1, B> | Promise<Either<E1, B>>
): Either<E | E1, B> | Promise<Either<E | E1, B>> => {
  if (isLeft(response)) return response;
  return fn(response.right);
};

export const url = (template: string, variables: object) => {
  return Object.entries(variables).reduce(
    (url, [key, value]) => url.replaceAll(`{${key}}`, String(value)),
    template
  );
};
