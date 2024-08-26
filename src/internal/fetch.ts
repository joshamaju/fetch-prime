import { map as mapE, isLeft, Either } from "fp-ts/Either";

import { Fetch } from "../Fetch.js";
import { HttpResponse } from "./response/index.js";
import { HttpError } from "./error.js";

export const raw = (url: string | URL, init?: RequestInit) => {
  return <E>(fetch: Fetch<E>) => fetch(url, init);
};

export const fetch = (url: string | URL, init?: RequestInit) => {
  return async <E>(fetch: Fetch<E>) => {
    const res = await fetch(url, init);
    return mapE((res: Response) => new HttpResponse(res))(res);
  };
};

export const flatMap = <E, A, E1, B, E2 = E>(
  request: (fetch: Fetch<E2>) => Promise<Either<E, A>>,
  fn: (res: A) => Promise<Either<E1, B>>
) => {
  return async (fetch: Fetch<E2>) => {
    const result = await request(fetch);
    if (isLeft(result)) return result;
    return fn(result.right);
  };
};

export const map = <E, A, B, E2 = E>(
  request: (fetch: Fetch<E2>) => Promise<Either<E, A>>,
  fn: (res: Either<E, A>) => B
) => {
  return async (fetch: Fetch<E2>) => {
    const result = await request(fetch);
    return fn(result);
  };
};
