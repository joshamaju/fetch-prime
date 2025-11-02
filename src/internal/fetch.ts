import { map as mapE, Either } from "fp-ts/Either";

import { Fetch, Init } from "../Fetch.js";
import { HttpResponse, HttpResponseEither } from "./response/index.js";
import { prepare } from "./body.js";

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
      mapE((res: Response) => new HttpResponse(res))(res)
    );
  };
};
