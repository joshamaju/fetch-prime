import { map as mapE } from "fp-ts/Either";

import { Fetch } from "../Fetch.js";
import { HttpResponse, HttpResponseEither } from "./response/index.js";

export const fetch = <E>(fetcher: Fetch<E>) => {
  return async (url: string | URL, init?: RequestInit) => {
    const res = await fetcher(url, init);
    return new HttpResponseEither(
      mapE((res: Response) => new HttpResponse(res))(res)
    );
  };
};
