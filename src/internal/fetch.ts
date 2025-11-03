import { map } from "fp-ts/Either";

import { Fetch, Init } from "../Fetch.js";
import { prepare } from "./body.js";
import { HttpResponse, HttpResponseEither } from "./response/index.js";

export const fetch = <E>(adapter: Fetch<E>) => {
  return (url: string | URL, init?: Init) => {
    const init_ = init ? prepare(init) : init;
    return adapter(url, init_);
  };
};

export const fetch_ = <E>(adapter: Fetch<E>) => {
  return async (url: string | URL, init?: Init) => {
    const res = await fetch(adapter)(url, init);
    return new HttpResponseEither(
      map((res: Response) => new HttpResponse(res))(res)
    );
  };
};
