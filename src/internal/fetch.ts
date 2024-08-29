import { map as mapE, Either } from "fp-ts/Either";

import { Fetch } from "../Fetch.js";
import { HttpResponse, HttpResponseEither } from "./response/index.js";

export const raw = (url: string | URL, init?: RequestInit) => {
  return <E>(fetch: Fetch<E>) => fetch(url, init);
};

export const fetch = (url: string | URL, init?: RequestInit) => {
  return async <E>(fetch: Fetch<E>) => {
    const res = await fetch(url, init);
    return new HttpResponseEither(
      mapE((res: Response) => new HttpResponse(res))(res)
    );
  };
};

export const map = <E, A, B, E2 = E>(
  request: (fetch: Fetch<E2>) => Promise<A>,
  fn: (res: A) => B
) => {
  return async (fetch: Fetch<E2>) => {
    const result = await request(fetch);
    return fn(result);
  };
};
