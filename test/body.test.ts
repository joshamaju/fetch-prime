import { expect, test } from "vitest";

import * as E from "fp-ts/Either";

import Adapter from "../src/Adapters/Platform.js";
import * as Body from "../src/Body.js";
import * as Interceptor from "../src/Interceptor.js";
import * as Http from "../src/index.js";

test("should attach JSON body and headers", async () => {
  let body;
  let headers;

  const spy = async (chain: Interceptor.Chain) => {
    body = chain.request.init?.body;
    headers = new Headers(chain.request.init?.headers);
    return E.right(new Response(""));
  };

  const interceptors = Interceptor.of(spy);

  const fetch = Http.fetch(Interceptor.make(interceptors)(Adapter));

  const data = { name: "morpheus", job: "leader" };

  const body_json = Body.json(data);

  await fetch("/users", body_json);

  const expected = '{"name":"morpheus","job":"leader"}';

  expect(body).toBe(expected);
  expect(headers.get("Content-Type")).toBe("application/json");
  expect(headers.get("Content-Length")).toBe(expected.length.toString());
});
