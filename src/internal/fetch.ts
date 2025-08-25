import { map as mapE, Either } from "fp-ts/Either";

import { Fetch } from "../Fetch.js";
import { HttpResponse, HttpResponseEither } from "./response/index.js";

export const raw = <E>(fetch: Fetch<E>) => {
  return (url: string | URL, init?: RequestInit) => {
    return fetch(url, init);
  };
};

export const fetch = <E>(fetch: Fetch<E>) => {
  return async (url: string | URL, init?: RequestInit) => {
    const res = await fetch(url, init);
    return new HttpResponseEither(
      mapE((res: Response) => new HttpResponse(res))(res),
    );
  };
};
