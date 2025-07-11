import { isLeft, Either, left, right } from "fp-ts/Either";
import { Adapter } from "../Fetch.js";
import { HttpError } from "./error.js";

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

export const neverThrow = (adapter: Adapter): Adapter => {
  return async (url, init) => {
    try {
      const res = await adapter(url, init);

      if ("_tag" in res) {
        if (isLeft(res)) throw res.left;
        return res;
      }

      return right(res);
    } catch (error) {
      return left(new HttpError(undefined, { cause: error }));
    }
  };
};
