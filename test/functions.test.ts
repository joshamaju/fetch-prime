import { expect, test } from "vitest";

import Adapter from "../src/adapters/Platform.js";
import { neverThrow, url } from "../src/Function.js";
import * as Interceptor from "../src/Interceptor.js";

test("should replace segments in url", async () => {
  let url_: string | URL | undefined;

  const interceptor = async function (chain: Interceptor.Chain) {
    url_ = chain.request.url;
    const res = await chain.proceed(chain.request);
    return res;
  };

  const interceptors = Interceptor.of(interceptor);

  let fetch = Interceptor.make(interceptors)(neverThrow(Adapter));

  await fetch(
    url("/users/{user}/posts/{post}?before={user}", { user: 1, post: 2 })
  );

  expect(url_).toBe("/users/1/posts/2?before=1");
});
